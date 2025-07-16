<?php
header('Content-Type: application/json');
include __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id_producto']) || !is_numeric($data['id_producto'])) {
    echo json_encode(['success' => false, 'error' => 'ID inválido']);
    exit;
}

$id = intval($data['id_producto']);

// Primero eliminar en producto_proveedor
$sql1 = "DELETE FROM producto_proveedor WHERE id_producto=?";
$stmt1 = $conexion->prepare($sql1);
$stmt1->bind_param("i", $id);
$stmt1->execute(); // Ejecutamos aunque no haya relaciones

// Luego eliminar en producto
$sql2 = "DELETE FROM producto WHERE id_producto=?";
$stmt2 = $conexion->prepare($sql2);
$stmt2->bind_param("i", $id);

if ($stmt2->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt2->error]);
}

$stmt1->close();
$stmt2->close();
$conexion->close();
