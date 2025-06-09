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

// Consulta para obtener todas las ventas
$sql = "SELECT id_venta, id_producto, cantidad, precio, total, fecha, id_usuario FROM venta";
$result = $conn->query($sql);

$ventas = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ventas[] = $row;
    }
}

$conn->close();

// Devolver las ventas en formato JSON
header('Content-Type: application/json');
echo json_encode($ventas);
?>
