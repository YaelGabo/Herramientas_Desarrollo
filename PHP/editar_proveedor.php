<?php
header('Content-Type: application/json');
include __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id_proveedor'], $data['nombre'], $data['ruc'], $data['direccion'], $data['telefono'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$id = intval($data['id_proveedor']);
$nombre = $data['nombre'];
$ruc = $data['ruc'];
$direccion = $data['direccion'];
$telefono = $data['telefono'];

$sql = "UPDATE proveedores SET nombre=?, ruc=?, direccion=?, telefono=? WHERE id_proveedor=?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssssi", $nombre, $ruc, $direccion, $telefono, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conexion->close();
