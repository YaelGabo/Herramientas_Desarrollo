<?php
// importar_db.php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Parámetros de conexión
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_d";

// 1) Conectar al servidor
$conexion = new mysqli($servername, $username, $password);
if ($conexion->connect_error) {
    die("Conexión fallida al servidor MySQL: " . $conexion->connect_error);
}

// 2) Si la base de datos no existe, crearla e importar el SQL
if (!$conexion->select_db($dbname)) {
    $sql = file_get_contents(__DIR__ . '/../Database/herramientas_d_usuarios.sql') . "\n" .
           file_get_contents(__DIR__ . '/../Database/herramientas_d_producto.sql') . "\n" .
           file_get_contents(__DIR__ . '/../Database/herramientas_d_producto_proveedor.sql') . "\n" .
           file_get_contents(__DIR__ . '/../Database/herramientas_d_proveedores.sql') . "\n" .
           file_get_contents(__DIR__ . '/../Database/herramientas_d_venta.sql') . "\n" .
           file_get_contents(__DIR__ . '/../Database/herramientas_d_detalle_venta.sql');
    if (!$conexion->multi_query($sql)) {
        die("Error al importar la base de datos: " . $conexion->error);
    }
    // Asegurarse de procesar todos los resultados de multi_query
    do { } while ($conexion->more_results() && $conexion->next_result());
}

// 3) Seleccionar finalmente la base de datos
if (!$conexion->select_db($dbname)) {
    die("No se pudo seleccionar la base de datos '$dbname'");
}

// A partir de aquí, $conexion está correctamente conectado y listo para usarse
?>
