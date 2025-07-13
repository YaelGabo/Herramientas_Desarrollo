<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

// Incluir archivo de conexión
require __DIR__ . '/importar_db.php';

// Verificar que la conexión exista
if (!isset($conexion)) {
    echo json_encode(['error' => 'No se estableció la conexión con la base de datos.']);
    exit;
}

// Mostrar errores (solo para desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verificar autenticación
if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado.']);
    exit;
}

$id_usuario = $_SESSION['id'];

// Leer y decodificar entrada JSON
$input = file_get_contents("php://input");
error_log("JSON recibido: " . $input);
$data = json_decode($input, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos o vacíos.']);
    exit;
}

$errores = [];

$conexion->begin_transaction();


try {
    // Validar stock de todos los productos antes de registrar la venta
    foreach ($data as $item) {
        if (!isset($item['id_producto'], $item['cantidad'], $item['precio'])) {
            $errores[] = 'Faltan campos en uno o más productos.';
            continue;
        }
        $stmt = $conexion->prepare("SELECT stock FROM producto WHERE id_producto = ?");
        $stmt->bind_param("i", $item['id_producto']);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $producto = $resultado->fetch_assoc();
        if (!$producto) {
            $errores[] = "El producto con ID {$item['id_producto']} no existe.";
            continue;
        }
        if ($producto['stock'] < $item['cantidad']) {
            $errores[] = "Stock insuficiente para el producto con ID {$item['id_producto']}.";
            continue;
        }
    }

    if (count($errores) > 0) {
        $conexion->rollback();
        http_response_code(400);
        echo json_encode(['error' => $errores]);
        exit;
    }

    // Calcular el total de la venta
    $total_venta = 0;
    foreach ($data as $item) {
        $total_venta += $item['precio'] * $item['cantidad'];
    }

    // Insertar la venta (una sola vez)
    $fecha = date('Y-m-d');
    $stmt = $conexion->prepare("INSERT INTO venta (total, fecha, id_usuario) VALUES (?, ?, ?)");
    $stmt->bind_param("dsi", $total_venta, $fecha, $id_usuario);
    if (!$stmt->execute()) {
        $conexion->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar la venta: ' . $stmt->error]);
        exit;
    }
    $id_venta = $conexion->insert_id;

    // Insertar los detalles de la venta y actualizar el stock
    foreach ($data as $item) {
        $stmt = $conexion->prepare("INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiid", $id_venta, $item['id_producto'], $item['cantidad'], $item['precio']);
        if (!$stmt->execute()) {
            $conexion->rollback();
            http_response_code(500);
            echo json_encode(['error' => 'Error al guardar el detalle de venta: ' . $stmt->error]);
            exit;
        }
        // Actualizar stock del producto
        $stmt2 = $conexion->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
        $stmt2->bind_param("ii", $item['cantidad'], $item['id_producto']);
        if (!$stmt2->execute()) {
            $conexion->rollback();
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el stock: ' . $stmt2->error]);
            exit;
        }
    }

    // Si todo salió bien, confirmar la transacción
    $conexion->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Venta registrada correctamente',
        'id_venta' => $id_venta
    ]);

} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(['error' => 'Excepción capturada: ' . $e->getMessage()]);
}

$conexion->close();
?>
