<?php
// Iniciar sesión si aún no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Datos de conexión a la base de datos
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_desarrollo";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Leer los datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar datos
if (!isset($data['id_producto']) || !isset($data['stock_nuevo'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$idProducto = $data['id_producto'];
$stockNuevo = (int)$data['stock_nuevo'];

try {
    // Obtener el stock actual del producto
    $stmt = $conn->prepare("SELECT stock FROM producto WHERE id_producto = ?");
    $stmt->bind_param("s", $idProducto);
    $stmt->execute();
    $result = $stmt->get_result();
    $producto = $result->fetch_assoc();

    if (!$producto) {
        echo json_encode(["success" => false, "error" => "Producto no encontrado"]);
        exit;
    }

    $stockActual = (int)$producto['stock'];
    $stockActualizado = $stockActual + $stockNuevo;

    // Actualizar el stock en la base de datos
    $stmt = $conn->prepare("UPDATE producto SET stock = ? WHERE id_producto = ?");
    $stmt->bind_param("is", $stockActualizado, $idProducto);
    $stmt->execute();

    echo json_encode(["success" => true, "nuevo_stock" => $stockActualizado]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
