<?php
// mostrar_productos.php

// 1) Incluir y ejecutar la lógica de conexión/importación
include __DIR__ . '/importar_db.php';

// 2) Ejecutar la consulta de productos
$sql = "SELECT id_producto, nombre_producto, precio, stock, id_proveedor, estado, imagen FROM producto";
$resultado = $conexion->query($sql);

if ($resultado === false) {
    http_response_code(500);
    die(json_encode([ 'error' => "Error en la consulta SQL: " . $conexion->error ]));
}

// 3) Recolectar resultados
$data = [];
while ($row = $resultado->fetch_assoc()) {
    $data[] = $row;
}

// 4) Devolver JSON
header('Content-Type: application/json');
echo json_encode($data);

// 5) Cerrar conexión
$conexion->close();
