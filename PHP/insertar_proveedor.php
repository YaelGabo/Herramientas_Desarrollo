<?php
header('Content-Type: application/json');
include __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['nombre'], $data['ruc'], $data['direccion'], $data['telefono'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$nombre = $data['nombre'];
$ruc = $data['ruc'];
$direccion = $data['direccion'];
$telefono = $data['telefono'];

$sql = "INSERT INTO proveedores (nombre, ruc, direccion, telefono) VALUES (?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssss", $nombre, $ruc, $direccion, $telefono);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id_proveedor' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conexion->close();
?>
