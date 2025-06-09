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
    foreach ($data as $item) {
        if (!isset($item['id_producto'], $item['cantidad'], $item['precio'], $item['total'], $item['fecha'])) {
            $errores[] = 'Faltan campos en uno o más productos.';
            continue;
        }

        $id_producto = (int) $item['id_producto'];
        $cantidad = (int) $item['cantidad'];
        $precio = (float) $item['precio'];
        $total = (float) $item['total'];
        $fecha = $item['fecha'];

        // Verificar stock disponible
        $consulta_stock = $conexion->prepare("SELECT stock FROM producto WHERE id_producto = ?");
        $consulta_stock->bind_param("i", $id_producto);
        $consulta_stock->execute();
        $resultado = $consulta_stock->get_result();

        if ($resultado->num_rows === 0) {
            $errores[] = "Producto con ID $id_producto no encontrado.";
            continue;
        }

        $fila = $resultado->fetch_assoc();
        $stock_actual = (int) $fila['stock'];

        if ($stock_actual < $cantidad) {
            $errores[] = "Stock insuficiente para el producto ID $id_producto. Disponible: $stock_actual, requerido: $cantidad.";
            continue;
        }

        // Insertar venta
        $stmt = $conexion->prepare("INSERT INTO venta (id_producto, cantidad, precio, total, fecha, id_usuario) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            $errores[] = "Error al preparar la consulta: " . $conexion->error;
            continue;
        }

        $stmt->bind_param("iiddsi", $id_producto, $cantidad, $precio, $total, $fecha, $id_usuario);

        if (!$stmt->execute()) {
            $errores[] = "Error al insertar producto ID $id_producto: " . $stmt->error;
        }

        $stmt->close();

        // Actualizar stock
        $stmt_stock = $conexion->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
        $stmt_stock->bind_param("ii", $cantidad, $id_producto);
        if (!$stmt_stock->execute()) {
            $errores[] = "Error al actualizar stock del producto ID $id_producto: " . $stmt_stock->error;
        }
        $stmt_stock->close();
    }

    if (!empty($errores)) {
        $conexion->rollback();
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al procesar una o más ventas.',
            'detalles' => $errores
        ]);
    } else {
        $conexion->commit();
        echo json_encode(['success' => true, 'message' => 'Todos los productos se registraron y el stock fue actualizado.']);
    }

} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(['error' => 'Excepción capturada: ' . $e->getMessage()]);
}

$conexion->close();
?>
