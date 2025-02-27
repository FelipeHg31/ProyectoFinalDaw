<?
header('Content-Type: application/json; charset=utf-8');
include("credenciales.php");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE"); // Permite métodos HTTP específicos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permite encabezados específicos 

// Verifica si es una solicitud de preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

//Se realiza la conexion
$conexion = new mysqli($host, $usuario, $psw, "dbs13830374") or die("No se pudo conectar");

//Se obtiene la opcion crud que se desea realizar
$metPeticion = $_SERVER['REQUEST_METHOD'];

// Se separan las cadenas de texto desde la URL de la petición
$pet_url = explode('/', $_SERVER['REQUEST_URI']);

//Se revisa que la url tenga la cantidad de datos necesarios
if (count($pet_url) < 3) {
    echo json_encode(["error" => "Ruta no válida"]);
    exit();
}

//Se obtiene la tabla 
$tabla = $pet_url[3];

//Se redirige a la funcion especifica para cada tabla
switch ($tabla) {
    case 'usuarios':
        manejadorUsuarios($metPeticion);
        break;
    case 'fotos':
        manejadorFotos($metPeticion);
        break;
    case 'autores':
        manejadorAutores($metPeticion);
        break;
    case 'resena':
        manejadorResena($metPeticion);
        break;
    case 'categorias':
        manejadorCategorias($metPeticion);
        break;
    case 'grupos':
        manejadorGrupos($metPeticion);
        break;
    case 'comentGrupos':
        manejadorComentGrupos($metPeticion);
        break;
    case 'intGrupos':
        manejadorIntGrupos($metPeticion);
        break;
    case 'imgExternas':
        manejadorImgExternas($metPeticion);
        break;
    case 'imgGrupos':
        manejadorImgGrupos($metPeticion);
        break;
    default:
        echo json_encode(["error" => "Tabla no válida"]);
        break;
}

//GET: Obtiene todos los datos de la tabla
//POST: Crea un nuevo dato en la tabla
//PUT: Actualiza algun dato de la tabla
//DELETE: Borra algun dato de la tabla

function manejadorUsuarios($metodo)
{
    global $conexion;

    //Revisamos que proceso se realizara sobre la tabla

    if ($metodo === 'GET') {

        //Se realiza la consulta, se obtienen los datos y se envian en formato JSON
        $consulta = "SELECT * FROM usuarios";
        $result = $conexion->query($consulta);

        $usuarios = [];

        while ($fila = $result->fetch_assoc()) {
            $usuarios[] = $fila;
        }
        echo json_encode($usuarios);
    }

    if ($metodo === 'POST') {
        // Se lee el cuerpo de la solicitud
        $input = file_get_contents('php://input');
        //Pasamos el json obtenido a un array asociativo
        $data = json_decode($input, true);

        //Separamos los datos obtenidos
        $nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $correo = isset($data['correo']) ? $data['correo'] : null;
        $rol = isset($data['rol']) ? $data['rol'] : null;
        $password = isset($data['password']) ? $data['password'] : null;

        //Se revisan los datos y se realiza la consulta
        if ($nombre && $correo && $rol && $password) {
            $consulta = "INSERT INTO usuarios (nombre, correo, rol, password) VALUES ('$nombre', '$correo', '$rol', '$password')";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Usuario registrado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }
    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = isset($data['id']) ? $data['id'] : null;
        $nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $correo = isset($data['correo']) ? $data['correo'] : null;
        $rol = isset($data['rol']) ? $data['rol'] : null;
        $password = isset($data['password']) ? $data['password'] : null;

        if ($id && ($nombre || $correo || $rol || $password)) {
            // Se realizo la consulta de actualización usando COALESCE para mantener valores existentes si están vacíos
            $consulta = "UPDATE usuarios SET 
                         nombre = COALESCE(NULLIF('$nombre', ''), nombre),
                         correo = COALESCE(NULLIF('$correo', ''), correo),
                         rol = COALESCE(NULLIF('$rol', ''), rol),
                         password = COALESCE(NULLIF('$password', ''), password) 
                         WHERE id = '$id'";

            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Usuario actualizado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        // Obtenermos el ID del usuario desde la URL
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        //Se revisa si el ID existe, verificando que es un usuario registrado
        if ($id) {
            $consulta = "DELETE FROM usuarios WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Usuario eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el usuario: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de usuario no especificado"]);
        }
    }
}

function manejadorFotos($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM fotos";
        $result = $conexion->query($consulta);

        $fotos = [];

        while ($fila = $result->fetch_assoc()) {

            //Comprimimos la portada de la imagen en base64 para poder descomprimirlo en Angular
            if (!empty($fila['imagen'])) {
                $fila['imagen'] = base64_encode($fila['imagen']);
            }
            $fotos[] = $fila;
        }
        echo json_encode($fotos);
    }


    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $titulo = $data['titulo'] ?? null;
        $id_autor = $data['id_autor'] ?? null;
        $categoria = $data['categoria'] ?? null;
        $descripcion = $data['descripcion'] ?? null;
        $idUsSube = $data['idUsSube'] ?? null;

        // Validación de datos requeridos
        if ($titulo && $id_autor && $categoria && $idUsSube) {
            // Inserta el registro sin la imagen debido a que el tipo de dato crea errores al enviarlo todo junto al crear el dato desde 0.
            //Para insertar la imagen se actualiza la imagen una vez creada, haciendo la peticion desde angular con el ID que se devuelve desde la funcion.
            $stmt = $conexion->prepare("INSERT INTO fotos (titulo, id_autor, categoria, descripcion, idUsSube) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sissi", $titulo, $id_autor, $categoria, $descripcion, $idUsSube);

            if ($stmt->execute()) {
                // Se obtiene y envia el ID del último registro insertado
                $id_foto = $conexion->insert_id;
                echo json_encode(["message" => "Foto registrada correctamente", "id_foto" => $id_foto]);
            } else {
                echo json_encode(["error" => "Error en la base de datos: " . $conexion->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'PUT') {

        $inputData = json_decode(file_get_contents("php://input"), true);
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $titulo = $inputData['titulo'] ?? null;
        $categoria = $inputData['categoria'] ?? null;
        $descripcion = $inputData['descripcion'] ?? null;
        $id = $pet_url[4];

        // Verificar si hay una imagen nueva en el JSON
        if (isset($inputData['imagen']) && $inputData['imagen'] !== "") {
            //Descomprimimos la imagen y obtenemos solo la imagen
            $imagenData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $inputData['imagen']));
            $consulta = "UPDATE fotos SET 
                titulo = COALESCE(?, titulo),
                categoria = COALESCE(?, categoria),
                descripcion = COALESCE(?, descripcion),
                imagen = ?  
                WHERE id = ?";

            $stmt = $conexion->prepare($consulta);
            $stmt->bind_param("ssssi", $titulo, $categoria, $descripcion, $imagenData, $id);
        } else {
            // Se realiza la consulta sin la imagen
            $consulta = "UPDATE fotos SET 
                titulo = COALESCE(?, titulo),
                categoria = COALESCE(?, categoria),
                descripcion = COALESCE(?, descripcion)
                WHERE id = ?";

            $stmt = $conexion->prepare($consulta);
            $stmt->bind_param("sssi", $titulo, $categoria, $descripcion, $id);
        }

        if ($stmt->execute()) {
            echo json_encode(["message" => "Foto actualizada correctamente"]);
        } else {
            echo json_encode(["error" => "Error: " . $stmt->error]);
        }

        $stmt->close();
    }



    if ($metodo === 'DELETE') {

        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM fotos WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Foto eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el Foto: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de Foto no especificado"]);
        }
    }


}

function manejadorAutores($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM autores";
        $result = $conexion->query($consulta);

        $autores = [];

        while ($fila = $result->fetch_assoc()) {
            $autores[] = $fila;
        }
        echo json_encode($autores);
    }

    if ($metodo === 'POST') {

        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        $nombre = isset($data['nombre']) ? $data['nombre'] : null;

        if ($nombre) {
            $consulta = "INSERT INTO autores(nombre) VALUES ('$nombre')";

            // Ejecutamos la consulta y se devuelve la respuesta en formato JSON
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Autor creado exitosamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Falta el nombre del autor"]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = isset($data['id']) ? $data['id'] : null;
        $nombre = isset($data['nombre']) ? $data['nombre'] : null;

        //No se realiza la consulta por medio de blind deido a que no crea confilcto en el procedimiento.
        if ($id && $nombre) {
            $consulta = "UPDATE autores SET nombre = '$nombre' WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Autor actualizado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM autores WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Autor eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el autor: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID del autor no especificado"]);
        }
    }
}

function manejadorResena($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM resena";
        $result = $conexion->query($consulta);

        $resena = [];

        while ($fila = $result->fetch_assoc()) {
            $resena[] = $fila;
        }
        echo json_encode($resena);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $comentario = $data['comentario'];
        $id_autor = $data['id_autor'];
        $puntuacion = $data['puntuacion'];
        $id_Foto = $data['id_img'];
        //No se realiza la consulta por medio de blind deido a que no crea confilcto en el procedimiento.
        $consulta = "INSERT INTO resena(comentario, id_autor, puntuacion, id_img) VALUES ('$comentario', '$id_autor', '$puntuacion', '$id_Foto');";

        if ($conexion->query($consulta) === TRUE) {
            echo json_encode(["message" => "Interaccion creada exitosamente"]);
        } else {
            echo json_encode(["error" => "Error: " . $conexion->error]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = isset($data['id']) ? $data['id'] : null;
        $comentario = isset($data['comentario']) ? $data['comentario'] : null;
        $puntuacion = isset($data['puntuacion']) ? $data['puntuacion'] : null;
        $idFoto = isset($data['id_foto']) ? $data['id_foto'] : null;
        $idAutor = isset($data['id_autor']) ? $data['id_autor'] : null;

        if ($id) {
            $consulta = "UPDATE resena SET 
                comentario = COALESCE(?, comentario),
                id_autor = COALESCE(?, id_autor),
                puntuacion = COALESCE(?, puntuacion),
                id_img = COALESCE(?, id_img)
                WHERE id = ?";

            $stmt = $conexion->prepare($consulta);
            $stmt->bind_param("siiii", $comentario, $idAutor, $puntuacion, $idFoto, $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Reseña actualizada correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        // Obtener el ID del usuario de la URL
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM resena WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Reseña eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar la reseña: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de la reseña no especificada"]);
        }
    }
}

function manejadorCategorias($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM categoria";
        $result = $conexion->query($consulta);

        $categoria = [];

        while ($fila = $result->fetch_assoc()) {
            $categoria[] = $fila;
        }
        echo json_encode($categoria);
    }

}

function manejadorGrupos($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM grupos";
        $result = $conexion->query($consulta);

        $grupos = [];

        while ($fila = $result->fetch_assoc()) {
            $grupos[] = $fila;
        }
        echo json_encode($grupos);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $nombre = $data['nombre'] ?? null;
        $descripcion = $data['descripcion'] ?? null;
        $id_creador = $data['id_creador'] ?? null;

        //No se realiza la consulta por medio de blind deido a que no crea confilcto en el procedimiento.
        //Se revisab los valores que no pueden ser nulos aunquue los datos se revisen antes de enviar el fomrulurio en Angular
        if ($nombre && $id_creador) {
            $consulta = "INSERT INTO grupos (nombre, descripcion, id_creador) VALUES ('$nombre', '$descripcion', '$id_creador')";
            if ($conexion->query($consulta) === TRUE) {

                $id_nuevo_grupo = $conexion->insert_id;
                // Devolvuelve la respuesta incluyendo el id para realizar metodos en Angular
                echo json_encode(["message" => "Grupo creado correctamente", "id" => $id_nuevo_grupo]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = $data['id'] ?? null;
        $nombre = $data['nombre'] ?? null;
        $descripcion = $data['descripcion'] ?? null;
        $jefe = $data['id_creador'] ?? null;

        //No se realiza la consulta por medio de blind deido a que no crea confilcto en el procedimiento.
        if ($id) {
            if ($jefe == 0) {
                $jefe = null;
            }
            $consulta = "UPDATE grupos SET 
                nombre = COALESCE(NULLIF('$nombre', ''), nombre), 
                descripcion = COALESCE(NULLIF('$descripcion', ''), descripcion),
                id_creador = COALESCE(NULLIF('$jefe', ''), id_creador) 
                WHERE id = '$id'";

            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Grupo actualizado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM grupos WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Grupo eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el grupo: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID del grupo no especificado"]);
        }
    }
}

function manejadorComentGrupos($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM comentgrupos";
        $result = $conexion->query($consulta);

        $comentarios = [];

        while ($fila = $result->fetch_assoc()) {
            $comentarios[] = $fila;
        }
        echo json_encode($comentarios);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $comentario = $data['comentario'] ?? null;
        $id_us = $data['id_us'] ?? null;
        $id_grupo = $data['id_grupo'] ?? null;

        if ($comentario && $id_us && $id_grupo) {
            $consulta = "INSERT INTO comentgrupos (comentario, id_us, id_grupo) VALUES ('$comentario', '$id_us', '$id_grupo')";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Comentario agregado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = $data['id'] ?? null;
        $comentario = $data['comentario'] ?? null;
        $id_us = $data['id_us'] ?? null;
        $id_grupo = $data['id_grupo'] ?? null;

        if ($id) {

            if ($id_us == 0) {
                $id_us = null;
            }

            if ($comentario == "") {
                $comentario = null;
            }

            if ($id_grupo == 0) {
                $id_grupo = null;
            }

            $consulta = "UPDATE comentgrupos SET 
                comentario = COALESCE(?, comentario), 
                id_us = COALESCE(?, id_us), 
                id_grupo = COALESCE(?, id_grupo)
                WHERE id = ?";

            $stmt = $conexion->prepare($consulta);
            $stmt->bind_param("ssii", $comentario, $id_us, $id_grupo, $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Comentario actualizado correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }


    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM comentgrupos WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Comentario eliminado correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el comentario: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID del comentario no especificado"]);
        }
    }
}


function manejadorIntGrupos($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        // Obtener todos los registros
        $consulta = "SELECT * FROM intgrupos";
        $result = $conexion->query($consulta);

        $intGrupos = [];

        while ($fila = $result->fetch_assoc()) {
            $intGrupos[] = $fila;
        }
        echo json_encode($intGrupos);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id_grupo = $data['id_grupo'] ?? null;
        $id_us = $data['id_us'] ?? null;

        if ($id_grupo && $id_us) {
            $consulta = "INSERT INTO intgrupos (id_grupo, id_us) VALUES ('$id_grupo', '$id_us')";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Interacción de grupo creada correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id_grupo = $pet_url[4] ?? null;
        $id_us = $pet_url[5] ?? null;

        if ($id_grupo && $id_us) {
            $consulta = "DELETE FROM intgrupos WHERE id_grupo = '$id_grupo' AND id_us = '$id_us'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Interacción de grupo eliminada correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar la interacción: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de la interacción no especificado"]);
        }
    }
}


function manejadorImgExternas($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM imgexternas";
        $result = $conexion->query($consulta);

        $imagenes = [];

        while ($fila = $result->fetch_assoc()) {
            $imagenes[] = $fila;
        }
        echo json_encode($imagenes);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $urlApi = $data['urlApi'] ?? null;
        $idImg = $data['idImgExt'] ?? null;

        if ($urlApi) {
            $stmt = $conexion->prepare("INSERT INTO imgexternas (urlApi, idImg) VALUES (?, ?)");
            $stmt->bind_param("ss", $urlApi, $idImg);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Imagen externa registrada correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id = isset($data['id']) ? $data['id'] : null;
        $urlApi = isset($data['urlApi']) ? $data['urlApi'] : null;
        $idImg = isset($data['idImg']) ? $data['idImg'] : null;

        if ($id) {
            if ($urlApi == "") {
                $urlApi = null;
            }

            $consulta = "UPDATE imgexternas SET 
                urlApi = COALESCE(?, urlApi), 
                idImg = COALESCE(?, idImg)
                WHERE id = ?";

            $stmt = $conexion->prepare($consulta);
            $stmt->bind_param("ssi", $urlApi, $idImg, $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Imagen externa actualizada correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id = $pet_url[4] ?? null;

        if ($id) {
            $consulta = "DELETE FROM imgexternas WHERE id = '$id'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Imagen externa eliminada correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar la imagen externa: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de la imagen no especificado"]);
        }
    }
}

function manejadorImgGrupos($metodo)
{
    global $conexion;

    if ($metodo === 'GET') {
        $consulta = "SELECT * FROM imggrupos";
        $result = $conexion->query($consulta);

        $imgGrupos = [];

        while ($fila = $result->fetch_assoc()) {
            $imgGrupos[] = $fila;
        }
        echo json_encode($imgGrupos);
    }

    if ($metodo === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id_grupo = $data['id_grupo'] ?? null;
        $id_img = $data['id_img'] ?? null;
        $tipoImagen = $data['tipoImagen'] ?? null;

        if ($id_grupo && $id_img) {
            $consulta = "INSERT INTO imggrupos (id_grupo, id_img, tipoImagen) 
                         VALUES ('$id_grupo', '$id_img', '$tipoImagen')";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Imagen de grupo creada correctamente"]);
            } else {
                echo json_encode(["error" => "Error: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
        }
    }

    if ($metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        $id_grupo = $data['id_grupo'] ?? null;
        $id_img = $data['id_img'] ?? null;
        $nuevo_tipoImagen = $data['tipoImagen'] ?? null;

        if ($id_grupo && $id_img && $nuevo_tipoImagen) {
            $consulta = "UPDATE imggrupos 
                         SET tipoImagen = '$nuevo_tipoImagen' 
                         WHERE id_grupo = '$id_grupo' AND id_img = '$id_img'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Imagen de grupo actualizada correctamente"]);
            } else {
                echo json_encode(["error" => "Error al actualizar la imagen de grupo: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "Faltan campos obligatorios para la actualización"]);
        }
    }

    if ($metodo === 'DELETE') {
        $pet_url = explode('/', $_SERVER['REQUEST_URI']);
        $id_grupo = $pet_url[4] ?? null;
        $id_img = $pet_url[5] ?? null;

        if ($id_grupo && $id_img) {
            $consulta = "DELETE FROM imggrupos WHERE id_grupo = '$id_grupo' AND id_img = '$id_img'";
            if ($conexion->query($consulta) === TRUE) {
                echo json_encode(["message" => "Imagen de grupo eliminada correctamente"]);
            } else {
                echo json_encode(["error" => "Error al eliminar la imagen de grupo: " . $conexion->error]);
            }
        } else {
            echo json_encode(["error" => "ID de la imagen de grupo no especificado"]);
        }
    }
}

//Cierre de la conexión
$conexion->close();