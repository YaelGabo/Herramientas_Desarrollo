<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Conexión directa sin include
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_d";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Obtener los datos del body JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_producto']) || !isset($data['nuevo_estado'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos."]);
    exit;
}

$id_producto = intval($data['id_producto']);
$nuevo_estado = intval($data['nuevo_estado']);

$sql = "UPDATE producto SET estado = ? WHERE id_producto = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $nuevo_estado, $id_producto);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
