<?php
header('Content-Type: application/json');

// Configura conexión
$servername = "localhost:3306";
$username = "root";
$password = "";
$dbname = "herramientas_desarrollo";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Recibe datos del formulario
$nombre = $_POST['nombre_producto'] ?? '';
$precio = $_POST['precio'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$id_proveedor = $_POST['id_proveedor'] ?? 0;
$estado = $_POST['estado'] ?? '';
$imagen = $_FILES['imagen'] ?? null;

// Validación básica
if (empty($nombre) || empty($precio) || empty($stock) || empty($id_proveedor) || empty($estado) || !$imagen) {
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

// Guardar imagen
$nombreImagen = time() . '_' . basename($imagen['name']);
$directorio = '../Imagenes/';
$rutaDestino = $directorio . $nombreImagen;

if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
    echo json_encode(['success' => false, 'error' => 'Error al subir la imagen']);
    exit;
}

// Insertar en la base de datos
$stmt = $conn->prepare("INSERT INTO producto (nombre_producto, precio, stock, id_proveedor, estado, imagen) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sdiiss", $nombre, $precio, $stock, $id_proveedor, $estado, $nombreImagen);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar en la base de datos: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
