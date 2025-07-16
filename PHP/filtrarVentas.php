<?php
// Iniciar sesión si aún no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Encabezado para devolver JSON
header('Content-Type: application/json');

// Datos de conexión a la base de datos
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_d";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Recibir datos JSON del cuerpo
$input = json_decode(file_get_contents("php://input"), true);
$de = $input['fechaDesde'] ?? '';
$hasta = $input['fechaHasta'] ?? '';

if (!$de || !$hasta) {
    echo json_encode(["error" => "Fechas no válidas"]);
    exit;
}

// Consulta con JOIN para traer los datos completos
$sql = "SELECT v.id_venta, dv.id_producto, dv.cantidad, dv.precio, v.total, v.fecha, v.id_usuario
        FROM venta v
        INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        WHERE v.fecha BETWEEN ? AND ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $de, $hasta);
$stmt->execute();
$resultado = $stmt->get_result();

$ventas = array();
while ($fila = $resultado->fetch_assoc()) {
    $ventas[] = $fila;
}

echo json_encode($ventas);
?>
