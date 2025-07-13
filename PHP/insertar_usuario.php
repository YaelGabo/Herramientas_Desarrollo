
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/importar_db.php';

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

$nombre = $data['nombre'] ?? '';
$primerApellido = $data['primerApellido'] ?? '';
$dni = $data['dni'] ?? '';
$direccion = $data['direccion'] ?? '';
$numeroTelefonico = $data['numeroTelefonico'] ?? '';
$correoElectronico = $data['correoElectronico'] ?? '';
$nombreUsuario = $data['nombreUsuario'] ?? '';
$contrasena = $data['contrasena'] ?? '';
$tipoUsuario = $data['tipoUsuario'] ?? '';

// Validación básica
if (empty($nombre) || empty($primerApellido) || empty($dni) || empty($direccion) || empty($numeroTelefonico) || empty($correoElectronico) || empty($nombreUsuario) || empty($contrasena) || empty($tipoUsuario)) {
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar si el usuario, correo o dni ya existen
$stmt = $conexion->prepare("SELECT id FROM usuarios WHERE nombreUsuario = ? OR correoElectronico = ? OR dni = ?");
$stmt->bind_param("sss", $nombreUsuario, $correoElectronico, $dni);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $stmt->close();
    echo json_encode(['success' => false, 'error' => 'El usuario, correo o DNI ya existe']);
    exit;
}
$stmt->close();

// Hash de la contraseña
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conexion->prepare("INSERT INTO usuarios (nombre, primerApellido, dni, direccion, numeroTelefonico, correoElectronico, nombreUsuario, contrasena, tipoUsuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $nombre, $primerApellido, $dni, $direccion, $numeroTelefonico, $correoElectronico, $nombreUsuario, $hash, $tipoUsuario);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conexion->close();
