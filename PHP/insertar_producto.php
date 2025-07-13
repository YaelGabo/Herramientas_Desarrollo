<?php
header('Content-Type: application/json');

// Error handling function
function sendError($message) {
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

// Database connection
$servername = "localhost:3306";
$username = "root";
$password = "G@bo1007";
$dbname = "herramientas_d";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    sendError('Error de conexión a la base de datos');
}

// Form data validation
$nombre = trim($_POST['nombre_producto'] ?? '');
$precio = floatval($_POST['precio'] ?? 0);
$stock = intval($_POST['stock'] ?? 0);
$id_proveedor = intval($_POST['id_proveedor'] ?? 0);
$estado = trim($_POST['estado'] ?? '');
$imagen = $_FILES['imagen'] ?? null;

// Validate required fields
if (empty($nombre)) sendError('El nombre del producto es obligatorio');
if ($precio <= 0) sendError('El precio debe ser mayor a 0');
if ($stock < 0) sendError('El stock no puede ser negativo');
if ($id_proveedor <= 0) sendError('Debe seleccionar un proveedor válido');
if (!in_array($estado, ['Activo', 'Inactivo'])) sendError('Estado no válido');
if (!$imagen) sendError('La imagen es obligatoria');

// Validate image
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$maxSize = 2 * 1024 * 1024; // 2MB

if (!in_array($imagen['type'], $allowedTypes)) {
    sendError('El archivo debe ser una imagen en formato JPG, JPEG, PNG o WEBP');
}

if ($imagen['size'] > $maxSize) {
    sendError('La imagen no debe superar los 2MB');
}

// Validate provider exists
$stmt = $conn->prepare("SELECT id_proveedor FROM proveedores WHERE id_proveedor = ?");
$stmt->bind_param("i", $id_proveedor);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    $stmt->close();
    sendError('El proveedor seleccionado no existe');
}
$stmt->close();

// Generate unique filename
$extension = pathinfo($imagen['name'], PATHINFO_EXTENSION);
$nombreImagen = time() . '_' . uniqid() . '.' . $extension;
$directorio = '../Imagenes/';
$rutaDestino = $directorio . $nombreImagen;

// Create directory if it doesn't exist
if (!file_exists($directorio)) {
    mkdir($directorio, 0777, true);
}

// Save image
if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
    sendError('Error al subir la imagen. Por favor intente nuevamente');
}

// Database insert
try {
    $stmt = $conn->prepare("INSERT INTO producto (nombre_producto, precio, stock, estado, imagen) VALUES (?, ?, ?, ?, ?)");
    $estado_num = ($estado === 'Activo' || $estado === '1' || $estado === 1) ? 1 : 0;
    $stmt->bind_param("sdiis", $nombre, $precio, $stock, $estado_num, $nombreImagen);

    if (!$stmt->execute()) {
        // If insert fails, remove uploaded image
        if (file_exists($rutaDestino)) {
            unlink($rutaDestino);
        }
        throw new Exception($stmt->error);
    }

    $id_producto = $conn->insert_id;

    // Insertar relación con proveedor en tabla producto_proveedor
    $stmt_rel = $conn->prepare("INSERT INTO producto_proveedor (id_producto, id_proveedor) VALUES (?, ?)");
    $stmt_rel->bind_param("ii", $id_producto, $id_proveedor);
    if (!$stmt_rel->execute()) {
        // Si falla la relación, eliminar producto e imagen
        $stmt_rel->close();
        $conn->query("DELETE FROM producto WHERE id_producto = $id_producto");
        if (file_exists($rutaDestino)) {
            unlink($rutaDestino);
        }
        throw new Exception("Error al guardar la relación producto-proveedor: " . $stmt_rel->error);
    }
    $stmt_rel->close();

    echo json_encode([
        'success' => true,
        'message' => 'Producto guardado exitosamente',
        'id' => $id_producto
    ]);

} catch (Exception $e) {
    sendError('Error al guardar en la base de datos: ' . $e->getMessage());
} finally {
    $stmt->close();
    $conn->close();
}
?>
