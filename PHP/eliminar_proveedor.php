<?php
header('Content-Type: application/json');
include __DIR__ . '/importar_db.php';

if (!isset($_POST['id_proveedor'])) {
    echo json_encode(['success' => false, 'error' => 'ID de proveedor no proporcionado']);
    exit;
}

$id = intval($_POST['id_proveedor']);
$sql = "DELETE FROM proveedores WHERE id_proveedor = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conexion->close();
