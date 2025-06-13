<?php
// importar_db.php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Parámetros de conexión
$servername = "localhost:3306";
$username = "root";
$password = "G@bo1007";
$dbname = "herramientas_desarrollo";

// 1) Conectar al servidor
$conexion = new mysqli($servername, $username, $password);
if ($conexion->connect_error) {
    die("Conexión fallida al servidor MySQL: " . $conexion->connect_error);
}

// 2) Si la base de datos no existe, crearla e importar el SQL
if (!$conexion->select_db($dbname)) {
    $sql = file_get_contents(__DIR__ . '/database/registro_usuario.sql');
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
