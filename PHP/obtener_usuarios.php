
<?php
header('Content-Type: application/json');

try {
    require_once 'importar_db.php';

    // Usar la variable correcta de conexión: $conexion
    $sql = "SELECT id, nombre, primerApellido, dni, direccion, numeroTelefonico, correoElectronico, nombreUsuario, tipoUsuario FROM usuarios";
    $result = $conexion->query($sql);
    if ($result === false) {
        throw new Exception("Error en la consulta SQL: " . $conexion->error);
    }
    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    echo json_encode($usuarios);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($result) && $result instanceof mysqli_result) {
        $result->free();
    }
    if (isset($conexion)) {
        $conexion->close();
    }
}
