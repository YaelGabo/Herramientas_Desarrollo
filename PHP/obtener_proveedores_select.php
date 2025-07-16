<?php
header('Content-Type: application/json');

$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_d";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}


$sql = "SELECT id_proveedor, nombre FROM proveedores";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(['success' => false, 'error' => 'Error al obtener proveedores']);
    exit;
}

$proveedores = [];
while($row = $result->fetch_assoc()) {
    $proveedores[] = $row;
}

echo json_encode(['success' => true, 'proveedores' => $proveedores]);

$conn->close();
?>
