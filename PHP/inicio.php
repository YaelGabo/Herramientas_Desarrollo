<?php 
// Datos de conexión a la base de datos
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_d";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Recoger los datos del formulario
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombreUsuario = $_POST['username'];
    $contrasena = $_POST['password'];

    // Verificar si el usuario existe en la base de datos

    $sql = "SELECT id, contrasena FROM usuarios WHERE nombreUsuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nombreUsuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Usuario encontrado, verificar contraseña
        $stmt->bind_result($idUsuario, $hashedPassword);
        $stmt->fetch();

        if (password_verify($contrasena, $hashedPassword)) {
            // Guardar id en la sesión
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['id'] = $idUsuario;
            $_SESSION['nombreUsuario'] = $nombreUsuario;

            // Redirigir según el tipo de usuario
            if (strpos($nombreUsuario, 'U') === 0) {
                header("Location: ../paginas/FarmaTotal.html"); // Ruta relativa para usuarios
            } elseif (strpos($nombreUsuario, 'A') === 0) {
                header("Location: ../paginas/Medicamentos.html"); // Ruta relativa para administradores
            }
            exit();
        } else {
            // Contraseña incorrecta
            echo "<p style='color:red; text-align:center;'>Contraseña incorrecta. Inténtelo de nuevo.</p>";
        }
    } else {
        // Usuario no encontrado
        echo "<p style='color:red; text-align:center;'>No estás registrado. Regístrate primero.</p>";
    }

    // Cerrar el statement y la conexión
    $stmt->close();
}

$conn->close();
?>
