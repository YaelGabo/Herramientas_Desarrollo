<?php
$servername = "127.0.0.1";
$username = "root";  // Este es el valor predeterminado para MySQL en XAMPP
$password = "G@bo1007";      // Si no tienes contraseña en MySQL
$dbname = "herramientas_desarrollo";  // Nombre de tu base de datos

// Crea la conexión
$conn = new mysqli($servername, $username, $password);

// Verifica si la conexión fue exitosa
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verifica si la base de datos existe, si no, la crea e importa el archivo .sql
if (!$conn->select_db($dbname)) {
    // Si la base de datos no existe, importamos el archivo .sql
    $sql = file_get_contents('database/registro_usuario.sql');  // Ruta a tu archivo .sql

    // Ejecutamos la importación
    if ($conn->multi_query($sql)) {
        echo "Base de datos importada correctamente.";
    } else {
        echo "Error al importar base de datos: " . $conn->error;
    }
}

// Cierra la conexión
$conn->close();
?>
