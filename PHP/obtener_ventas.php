<?php
// Iniciar sesión si aún no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Datos de conexión a la base de datos
$servername = "localhost:3306";
$username = "root";
$password = "G@bo1007";
$dbname = "herramientas_d";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener todas las ventas
$sql = "SELECT v.id_venta, dv.id_producto, p.nombre as nombre_producto, dv.cantidad, 
        dv.precio, v.total, v.fecha, v.id_usuario, u.nombre as nombre_usuario 
        FROM venta v 
        INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta 
        INNER JOIN producto p ON dv.id_producto = p.id_producto 
        INNER JOIN usuarios u ON v.id_usuario = u.id";
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
