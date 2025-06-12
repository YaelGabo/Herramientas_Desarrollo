<?php
include __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id_producto'];
$nombre = $data['nombre_producto'];
$precio = $data['precio'];
$stock = $data['stock'];

$sql = "UPDATE producto SET nombre_producto=?, precio=?, stock=? WHERE id_producto=?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sdii", $nombre, $precio, $stock, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}

$stmt->close();
$conexion->close();
