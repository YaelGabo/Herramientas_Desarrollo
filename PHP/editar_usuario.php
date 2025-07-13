
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/importar_db.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'], $data['nombre'], $data['primerApellido'], $data['dni'], $data['direccion'], $data['numeroTelefonico'], $data['correoElectronico'], $data['nombreUsuario'], $data['tipoUsuario'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$id = intval($data['id']);
$nombre = $data['nombre'];
$primerApellido = $data['primerApellido'];
$dni = $data['dni'];
$direccion = $data['direccion'];
$numeroTelefonico = $data['numeroTelefonico'];
$correoElectronico = $data['correoElectronico'];
$nombreUsuario = $data['nombreUsuario'];
$tipoUsuario = $data['tipoUsuario'];
$nuevaContrasena = isset($data['contrasena']) ? $data['contrasena'] : '';
$contrasenaActual = isset($data['contrasenaActual']) ? $data['contrasenaActual'] : '';


// Si se quiere cambiar la contraseña, siempre validar la actual
if (!empty($nuevaContrasena)) {
    // Validar contraseña actual
    $stmt = $conexion->prepare("SELECT contrasena FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($hashActual);
    if ($stmt->fetch()) {
        $stmt->close();
        if (empty($contrasenaActual) || !password_verify($contrasenaActual, $hashActual)) {
            echo json_encode(['success' => false, 'error' => 'La contraseña actual es incorrecta']);
            exit;
        }
    } else {
        $stmt->close();
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
        exit;
    }
    // Cambiar contraseña
    $hashNueva = password_hash($nuevaContrasena, PASSWORD_DEFAULT);
    $sql = "UPDATE usuarios SET nombre=?, primerApellido=?, dni=?, direccion=?, numeroTelefonico=?, correoElectronico=?, nombreUsuario=?, contrasena=?, tipoUsuario=? WHERE id=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssssssssi", $nombre, $primerApellido, $dni, $direccion, $numeroTelefonico, $correoElectronico, $nombreUsuario, $hashNueva, $tipoUsuario, $id);
} else {
    // No cambiar contraseña
    $sql = "UPDATE usuarios SET nombre=?, primerApellido=?, dni=?, direccion=?, numeroTelefonico=?, correoElectronico=?, nombreUsuario=?, tipoUsuario=? WHERE id=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssssssi", $nombre, $primerApellido, $dni, $direccion, $numeroTelefonico, $correoElectronico, $nombreUsuario, $tipoUsuario, $id);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conexion->close();
