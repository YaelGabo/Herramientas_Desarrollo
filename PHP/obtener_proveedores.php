<?php
header('Content-Type: application/json');
include __DIR__ . '/importar_db.php';

$sql = "SELECT id_proveedor, nombre, ruc, direccion, telefono FROM proveedores";
$result = $conexion->query($sql);

if ($result === false) {
    echo json_encode(['success' => false, 'error' => 'Error al obtener proveedores']);
    exit;
}

$proveedores = [];
while($row = $result->fetch_assoc()) {
    $proveedores[] = $row;
}

echo json_encode(['success' => true, 'proveedores' => $proveedores]);

$conexion->close();
?>
