<?php
include __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents("php://input"), true);


$id = $data['id_producto'];
$nombre = $data['nombre_producto'];
$precio = $data['precio'];
$stock = $data['stock'];
$id_proveedor = isset($data['id_proveedor']) ? $data['id_proveedor'] : null;

$sql = "UPDATE producto SET nombre_producto=?, precio=?, stock=? WHERE id_producto=?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sdii", $nombre, $precio, $stock, $id);

$success = false;
if ($stmt->execute()) {
    $success = true;
    // Si se envía un proveedor, actualizar la relación
    if ($id_proveedor) {
        // Eliminar relaciones anteriores
        $conexion->query("DELETE FROM producto_proveedor WHERE id_producto = $id");
        // Insertar nueva relación
        $stmt_rel = $conexion->prepare("INSERT INTO producto_proveedor (id_producto, id_proveedor) VALUES (?, ?)");
        $stmt_rel->bind_param("ii", $id, $id_proveedor);
        if (!$stmt_rel->execute()) {
            $success = false;
            echo json_encode(["success" => false, "error" => $stmt_rel->error]);
            $stmt_rel->close();
            $stmt->close();
            $conexion->close();
            exit;
        }
        $stmt_rel->close();
    }
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}

$stmt->close();
$conexion->close();
