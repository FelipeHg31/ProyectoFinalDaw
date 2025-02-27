<?
include("credenciales.php");

//Guardamos las direcciones de las imagenes
$img1 = "assets/base.jpg";
$img2 = "assets/escritor.jpg";
$img3 = "assets/inicio.jpg";
$img4 = "assets/portada.jpg";
$img5 = "assets/regist.jpg";
$img6 = "assets/subirLibro.jpg";
$img7 = "assets/Guardar.jpg";
$img8 = "assets/registro.jpg";
$img9 = "assets/camaras.jpg";
$img10 = "assets/ini.jpg";
$img11 = "assets/misLibros.jpg";
$img12 = "assets/fots.jpg";
$img13 = "assets/admin.jpg";
$img14 = "assets/gruposMelos.jpg";
$img15 = "assets/grupos.jpg";



/*Ingreso de usarios */
$conexion = new mysqli($host, $usuario, $psw, "dbs13830374") or die("No se pudo conectar");

$consulta = "INSERT INTO autores(nombre) VALUES ('autor 1');
INSERT INTO usuarios (nombre, correo, password, rol) VALUES ('usuario1','us1@correo.com', '1234', 'administrador');
INSERT INTO usuarios (nombre, correo, password, rol) VALUES ('usuario2','us2@correo.com', '1234', 'usuario');
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar autores y usuarios: " . $conexion->error);
}

$conexion->close();

/*Ingreso de las categorias*/

$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO categoria(nombre) VALUES ('ciencia');
INSERT INTO categoria(nombre) VALUES ('Arte');
INSERT INTO categoria(nombre) VALUES ('Ciencia');
INSERT INTO categoria(nombre) VALUES ('Naturaleza');
INSERT INTO categoria(nombre) VALUES ('Arquitectura');
INSERT INTO categoria(nombre) VALUES ('Personas');
INSERT INTO categoria(nombre) VALUES ('Viajes');
INSERT INTO categoria(nombre) VALUES ('Cultura');
INSERT INTO categoria(nombre) VALUES ('Acción');
INSERT INTO categoria(nombre) VALUES ('Comedia');
INSERT INTO categoria(nombre) VALUES ('Terror');
INSERT INTO categoria(nombre) VALUES ('Festividades');
INSERT INTO categoria(nombre) VALUES ('Abstracto');
INSERT INTO categoria(nombre) VALUES ('Anime');
INSERT INTO categoria(nombre) VALUES ('Deportes');
INSERT INTO categoria(nombre) VALUES ('Juegos');
INSERT INTO categoria(nombre) VALUES ('Teconologia');
INSERT INTO categoria(nombre) VALUES ('Videojuegos');
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar categorías: " . $conexion->error);
}

$conexion->close();

$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

// Obtener el contenido de la imagen
$contImg1 = addslashes(file_get_contents($img1)); 
$contImg2 = addslashes(file_get_contents($img2));
$contImg3 = addslashes(file_get_contents($img3));
$contImg4 = addslashes(file_get_contents($img4));
$contImg5 = addslashes(file_get_contents($img5));
$contImg6 = addslashes(file_get_contents($img6));
$contImg7 = addslashes(file_get_contents($img7));
$contImg8 = addslashes(file_get_contents($img8));
$contImg9 = addslashes(file_get_contents($img9));
$contImg10 = addslashes(file_get_contents($img10));
$contImg11 = addslashes(file_get_contents($img11));
$contImg12 = addslashes(file_get_contents($img12));
$contImg13 = addslashes(file_get_contents($img13));
$contImg14 = addslashes(file_get_contents($img14));
$contImg15 = addslashes(file_get_contents($img15));

// Ingreso de las imagenes
$consulta = "INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('base', 1, 'Teconologia', 'Foto de un sistema de base de datos', 1, '$contImg1');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('escritor', 1, 'Cultura', 'Maquina de escribir', 1, '$contImg2');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('inicio', 1, 'Cultura', 'Biblioteca con poca luz', 1, '$contImg3');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('portada', 1, 'Cultura', 'Libros con flores marchitadas encima', 1, '$contImg4');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('regist', 1, 'Cultura', 'Muchos libros esparcidos', 1, '$contImg5');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('subirLibro', 1, 'Cultura', 'Una libreta con escritos y un boligrafo encima', 1, '$contImg6');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('Guardar', 1, 'Arte', 'Monton de hojas colocadas en el techo', 1, '$contImg7');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('registro', 1, 'Cultura', 'Hombre leyendo en una biblioteca', 1, '$contImg8');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('base1', 1, 'Teconologia', 'Foto de un sistema de base de datos', 2, '$contImg1');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('escritor1', 1, 'Cultura', 'Maquina de escribir', 2, '$contImg2');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('inicio1', 2, 'Cultura', 'Biblioteca con poca luz', 1, '$contImg3');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('portada1', 2, 'Cultura', 'Libros con flores marchitadas encima', 2, '$contImg4');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('regist1', 1, 'Cultura', 'Muchos libros esparcidos', 1, '$contImg5');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('subirLibro1', 1, 'Cultura', 'Una libreta con escritos y un boligrafo encima', 1, '$contImg6');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('Guardar1', 2, 'Arte', 'Monton de hojas colocadas en el techo', 2, '$contImg7');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen)
VALUES ('registro1', 1, 'Cultura', 'Hombre leyendo en una biblioteca', 1, '$contImg8');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('archivos', 1, 'Arte', 'Foto de archivo s', 2, '$contImg9');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img2', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg10');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img3', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg11');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img4', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg12');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img5', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg13');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img6', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg14');
INSERT INTO fotos(titulo, id_autor, categoria, descripcion, idUsSube, imagen) 
VALUES ('img7', 1, 'Arte', 'Contenido de imagen de arte', 2, '$contImg15');
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar las imagenes: " . $conexion->error);
}

$conexion->close();

//Entrada de opiniones
$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO resena(comentario, id_autor, puntuacion, id_img) 
VALUES ('es una buena imagen', 1, 5,  1);
INSERT INTO resena(comentario, id_autor, puntuacion, id_img) 
VALUES ('es una mala imagen', 1, 1,  4);
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar fotos: " . $conexion->error);
}
$conexion->close();

//Ingreso de grupos
$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO grupos (nombre, descripcion, id_creador) VALUES ('Artistico', 'Obras de arte para ver', 1);
INSERT INTO grupos (nombre, descripcion, id_creador) VALUES ('Arquitectura', 'Estructuras impresionantes', 2);
INSERT INTO grupos (nombre, descripcion, id_creador) VALUES ('Tecnologias', 'Para conocer de la tecnologia', 1);
";

if (!$conexion->multi_query($consulta)) {
    die("Error al crear los grupos: " . $conexion->error);
}
$conexion->close();

//Ingreso de comentarios en los grupos
$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('Me parece muy divertido el arte', 1, 1);
INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('Me parece muy divertido el arte', 1, 1);
INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('Alguien mas sabe de arte', 2, 1);
INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('yo, es muy divertido', 1, 1);
INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('Que impresionante', 2, 2);
INSERT INTO comentGrupos (comentario, id_us, id_grupo) VALUES ('quiero construir algo asi', 2, 2);
";

if (!$conexion->multi_query($consulta)) {
    die("Error a ingresar los comentarios de los grupos: " . $conexion->error);
}
$conexion->close();

//Ingreso de usuarios en los grupos
$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO intGrupos (id_grupo, id_us) VALUES (1, 1);
INSERT INTO intGrupos (id_grupo, id_us) VALUES (1, 2);
INSERT INTO intGrupos (id_grupo, id_us) VALUES (2, 2);
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar los usuarios en los grupos: " . $conexion->error);
}
$conexion->close();

//Ingreso de usuarios en los grupos
$conexion = new mysqli($host, $usuario, $psw, "Fotografias") or die("No se pudo conectar");

$consulta = "INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (1, 2, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (1, 4, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (1, 6, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (1, 8, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (3, 1, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (3, 11, 'local');
INSERT INTO ImgGrupos (id_grupo, id_img, tipoImagen)VALUES (2, 9, 'local');
";

if (!$conexion->multi_query($consulta)) {
    die("Error al insertar las imagenes en los grupos: " . $conexion->error);
}
$conexion->close();