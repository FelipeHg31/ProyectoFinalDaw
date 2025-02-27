<?
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

$filename = 'usuario.json';

//Se verifica el metodo con el que el cliente realiza la petición
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtiene el JSON enviado desde el cliente
    $data = json_decode(file_get_contents("php://input"), true);

    // Se verifican los datos que se enviaron en el cliente
    if ($data && isset($data['nombre']) && isset($data['rol']) && isset($data['id'])) {
        //Se guardan los datos en el archivo designado anteriormente y coificamos la información para que sea menos peso.
        file_put_contents($filename, json_encode($data));
        echo json_encode(["message" => "Usuario guardado con éxito"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Datos de usuario inválidos"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Verifica si el archivo existe antes de leerlo
    if (file_exists($filename)) {
        $usuario = json_decode(file_get_contents($filename), true);

        // Verifica que se haya decodificado correctamente y tenga las claves esperadas
        if (isset($usuario['nombre']) && isset($usuario['rol']) && isset($data['id'])) {
            echo json_encode($usuario);
        } else {
            echo json_encode(["message" => "Formato de datos incorrecto"]);
        }
    } else {
        echo json_encode(null);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
