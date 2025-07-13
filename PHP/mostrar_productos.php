<?php
// mostrar_productos.php

// 1) Incluir y ejecutar la lógica de conexión/importación
include __DIR__ . '/importar_db.php';

// 2) Ejecutar la consulta de productos con JOIN a proveedores (puede haber varios proveedores por producto)
$sql = "SELECT p.id_producto, p.nombre_producto, p.precio, p.stock, p.estado, p.imagen, 
        GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS proveedores
        FROM producto p
        LEFT JOIN producto_proveedor pp ON p.id_producto = pp.id_producto
        LEFT JOIN proveedores pr ON pp.id_proveedor = pr.id_proveedor
        GROUP BY p.id_producto, p.nombre_producto, p.precio, p.stock, p.estado, p.imagen";
$resultado = $conexion->query($sql);

if ($resultado === false) {
    http_response_code(500);
    die(json_encode([ 'error' => "Error en la consulta SQL: " . $conexion->error ]));
}

// 3) Recolectar resultados
$data = [];
while ($row = $resultado->fetch_assoc()) {
    // Convertir estado a texto para el frontend
    $row['estado'] = ($row['estado'] == 1) ? 'Activo' : 'Inactivo';
    $data[] = $row;
}

// 4) Devolver JSON
header('Content-Type: application/json');
echo json_encode($data);

// 5) Cerrar conexión
$conexion->close();
