<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Datos de conexión a la base de datos
    $servername = "localhost:3306";
    $username = "root";
    $password = "G@bo1007";
    $dbname = "herramientas_desarrollo";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Recoger los datos del formulario
    $nombre = $_POST['nombre'];
    $primerApellido = $_POST['primerApellido'];
    $dni = $_POST['dni'];
    $direccion = $_POST['direccion'];
    $numeroTelefonico = $_POST['NumeroTelefonico'];
    $correoElectronico = $_POST['correoElectronico'];
    $nombreUsuario = $_POST['nombreUsuario'];
    $contrasena = $_POST['contrasena'];
    $confirmarContrasena = $_POST['confirmarContrasena'];

    // Verificar si las contraseñas coinciden
    if ($contrasena !== $confirmarContrasena) {
        echo "Las contraseñas no coinciden. Por favor, intente de nuevo.";
        exit();
    }

    // Verificar si la contraseña cumple con los requisitos
    $passwordPattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/";
    if (!preg_match($passwordPattern, $contrasena)) {
        echo "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.";
        exit();
    }

    // Verificar si el usuario o el correo ya existen
    $check_sql = "SELECT * FROM usuarios WHERE nombreUsuario = ? OR correoElectronico = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("ss", $nombreUsuario, $correoElectronico);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Nombre de usuario o correo electrónico ya existe
        echo '<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registro Fallido</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .container { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; width: 80%; max-width: 600px; }
                .container h2 { color: #FF0000; }
                .container button { background-color: #FF0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; }
                .container button:hover { background-color: #cc0000; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Registro Fallido</h2>
                <p>El nombre de usuario o el correo electrónico ya están registrados.</p>
                <button onclick="window.location.href=\'../Paginas/register.html\'">Regresar</button>
            </div>
        </body>
        </html>';
    } else {
        // Insertar los datos en la base de datos
        $hashedPassword = password_hash($contrasena, PASSWORD_BCRYPT); // Encriptar la contraseña
        $sql = "INSERT INTO usuarios (nombre, primerApellido, dni, direccion, numeroTelefonico, correoElectronico, nombreUsuario, contrasena) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssss", $nombre, $primerApellido, $dni, $direccion, $numeroTelefonico, $correoElectronico, $nombreUsuario, $hashedPassword);

        if ($stmt->execute()) {
            // Mostrar los datos registrados
            echo '<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registro Exitoso</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; width: 80%; max-width: 600px; }
                    .container h2 { color: #4CAF50; }
                    .container button { background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; }
                    .container button:hover { background-color: #45a049; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Registro Exitoso</h2>
                    <p><strong>Nombre:</strong> ' . htmlspecialchars($nombre) . '</p>
                    <p><strong>Primer Apellido:</strong> ' . htmlspecialchars($primerApellido) . '</p>
                    <p><strong>DNI:</strong> ' . htmlspecialchars($dni) . '</p>
                    <p><strong>Dirección:</strong> ' . htmlspecialchars($direccion) . '</p>
                    <p><strong>Numero Telefónico:</strong> ' . htmlspecialchars($numeroTelefonico) . '</p>
                    <button onclick="window.location.href=\'../Inicio.html\'">Ir al Login</button>
                </div>
            </body>
            </html>';
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    // Cerrar conexión
    $stmt->close();
    $conn->close();

} else {
    // Redirigir al formulario si se intenta acceder al script directamente
    header('Location: Registrarse.html');
    exit();
}
?>
