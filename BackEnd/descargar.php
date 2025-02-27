<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$url = explode('/', $_SERVER['REQUEST_URI']);

// Validar si la ruta tiene suficiente información
if (count($url) < 3) {
    echo json_encode(["error" => "Ruta no válida"]);
    exit();
}

$opcion = $url[3];

// Procesar según la opción seleccionada
switch ($opcion) {
    case "local":
        guardarImagenes("local");
        break;

    case "externa":
        guardarExterna();

    case "subida":
        guardarImagenes("subida");
        break;

    case "unica":
        guardarImagen();
        break;
    default:
        echo json_encode(["error" => "Opción no válida"]);
        exit();
}

function guardarImagenes($tipo)
{
    $imagenes = json_decode(file_get_contents("php://input"), true)['imagenes'] ?? [];
    if (empty($imagenes)) {
        echo json_encode(["error" => "No se recibieron imágenes"]);
        exit();
    }

    // Crear un directorio temporal para las imágenes
    $tempDir = sys_get_temp_dir() . "/imagenes_" . $tipo . "_" . uniqid();
    if (!mkdir($tempDir) && !is_dir($tempDir)) {
        echo json_encode(["error" => "No se pudo crear el directorio temporal"]);
        exit();
    }

    foreach ($imagenes as $index => $img) {
        if (isset($img['imagen'])) {
            // Decodificar la imagen desde base64
            $contenido = base64_decode($img['imagen']);
            if ($contenido === false) {
                continue; // Saltar si no se puede decodificar
            }

            // Crear el nombre del archivo
            $titulo = $img['titulo'] ?? "imagen_$index";
            $titulo = preg_replace('/[^A-Za-z0-9_\-]/', '_', $titulo); // Reemplazar caracteres no válidos
            $path = $tempDir . "/$titulo.jpg";

            // Guardar la imagen en el archivo
            if (file_put_contents($path, $contenido)) {
                $rutasGuardadas[] = $path; // Agregar la ruta al array
            }
        }
    }

    if (isset($tempDir)) {
        $zip = new ZipArchive();
        $archivoZip = sys_get_temp_dir() . "/descargar_" . $tipo . "_" . uniqid() . ".zip";

        if ($zip->open($archivoZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            echo json_encode(["error" => "No se pudo crear el archivo ZIP"]);
            exit();
        }

        $archivos = scandir($tempDir);

        foreach ($archivos as $archivo) {
            if ($archivo !== '.' && $archivo !== '..') {
                $rutaCompleta = $tempDir . '/' . $archivo;
                if (is_file($rutaCompleta)) {
                    $zip->addFile($rutaCompleta, $archivo);
                }
            }
        }
        $zip->close();

        // Configurar encabezados para la descarga
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . basename($archivoZip) . '"');
        header('Content-Length: ' . filesize($archivoZip));

        // Enviar el archivo al cliente
        readfile($archivoZip);

        // Eliminar el archivo ZIP y el directorio temporal después de enviarlo
        unlink($archivoZip);
        array_map('unlink', glob("$tempDir/*.*")); // Eliminar archivos de la carpeta
        rmdir($tempDir);
        exit();
    }
}

function guardarImagen(){
    // Obtener datos enviados en la solicitud
    $data = json_decode(file_get_contents("php://input"), true);

    // Validar si se recibe la imagen y el título
    if (!isset($data['imagen']) || !isset($data['titulo'])) {
        echo json_encode(["error" => "Datos insuficientes: se requiere 'imagen' y 'titulo'"]);
        exit();
    }

    // Decodificar la imagen en base64
    $imagenBase64 = $data['imagen'];
    $contenido = base64_decode($imagenBase64);
    if ($contenido === false) {
        echo json_encode(["error" => "No se pudo decodificar la imagen"]);
        exit();
    }

    // Crear un archivo temporal para la imagen
    $titulo = preg_replace('/[^A-Za-z0-9_\-]/', '_', $data['titulo']); // Sanitizar el título
    $archivoTemporal = sys_get_temp_dir() . "/$titulo.jpg";

    // Guardar la imagen en el archivo temporal
    if (file_put_contents($archivoTemporal, $contenido) === false) {
        echo json_encode(["error" => "No se pudo guardar la imagen"]);
        exit();
    }

    // Enviar la imagen como respuesta para su descarga
    header('Content-Type: image/jpeg');
    header('Content-Disposition: attachment; filename="' . $titulo . '.jpg"');
    header('Content-Length: ' . filesize($archivoTemporal));

    readfile($archivoTemporal);

    // Eliminar el archivo temporal después de enviarlo
    unlink($archivoTemporal);
    exit();
}

function guardarExterna(){
    $data = json_decode(file_get_contents("php://input"), true);
$imagenes = $data['imagenes'] ?? [];

if (empty($imagenes)) {
    echo json_encode(["error" => "No se recibieron datos de imágenes"]);
    exit();
}

// Crear un directorio temporal
$tempDir = sys_get_temp_dir() . "/imagenes_url_" . uniqid();
if (!mkdir($tempDir) && !is_dir($tempDir)) {
    echo json_encode(["error" => "No se pudo crear el directorio temporal"]);
    exit();
}

// Descargar imágenes desde las URLs
$rutasGuardadas = [];
foreach ($imagenes as $index => $imagen) {
    $url = $imagen['urlApi'] ?? null; // URL de la imagen
    $idImg = $imagen['idImg'] ?? "imagen_$index"; // Nombre basado en idImg o índice
    $extension = pathinfo($url, PATHINFO_EXTENSION); // Extraer extensión de la URL
    $titulo = preg_replace('/[^A-Za-z0-9_\-]/', '_', $idImg) . "." . $extension; // Crear nombre seguro
    $path = $tempDir . "/$titulo";

    if ($url) {
        // Descargar la imagen desde la URL
        $contenido = file_get_contents($url);
        if ($contenido !== false) {
            // Guardar la imagen en el archivo
            if (file_put_contents($path, $contenido)) {
                $rutasGuardadas[] = $path; // Guardar la ruta del archivo descargado
            }
        }
    }
}

// Verificar si se guardaron imágenes
if (empty($rutasGuardadas)) {
    echo json_encode(["error" => "No se pudieron descargar las imágenes"]);
    array_map('unlink', glob("$tempDir/*.*")); // Eliminar archivos de la carpeta
    rmdir($tempDir);
    exit();
}

// Crear el archivo ZIP
$zip = new ZipArchive();
$archivoZip = sys_get_temp_dir() . "/descargar_imagenes_" . uniqid() . ".zip";

if ($zip->open($archivoZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo json_encode(["error" => "No se pudo crear el archivo ZIP"]);
    array_map('unlink', glob("$tempDir/*.*")); // Eliminar archivos de la carpeta
    rmdir($tempDir);
    exit();
}

// Agregar las imágenes al ZIP
foreach ($rutasGuardadas as $ruta) {
    $zip->addFile($ruta, basename($ruta));
}
$zip->close();

// Configurar encabezados para la descarga
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . basename($archivoZip) . '"');
header('Content-Length: ' . filesize($archivoZip));

// Enviar el archivo al cliente
readfile($archivoZip);

// Eliminar el archivo ZIP y los archivos temporales después de enviarlo
unlink($archivoZip);
array_map('unlink', glob("$tempDir/*.*")); // Eliminar archivos de la carpeta
rmdir($tempDir);

exit();
}
?>
