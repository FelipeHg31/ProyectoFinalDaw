<?php
include("credenciales.php");
//Proceso de creacion y/o conexion a la base de datos
$conexion = new mysqli($host, $usuario, $psw);

if ($conexion->connect_error) {
    die("Error: " . $conexion->connect_error);
}

$conexion->select_db("dbs13830374");

//Creacion de las tablas
$consulta = "CREATE TABLE IF NOT EXISTS usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(250) NOT NULL,
    password VARCHAR(200) NOT NULL, 
    rol VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS resena(
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario VARCHAR(220) NOT NULL,
    id_autor INT NOT NULL,
    puntuacion INT,
    id_img INT NOT NULL,
    FOREIGN KEY (id_autor) REFERENCES Usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS autores(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS fotos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    id_autor INT NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    descripcion TEXT,
    idUsSube INT NOT NULL,
    imagen MEDIUMBLOB
);

CREATE TABLE IF NOT EXISTS categoria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS grupos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(250) NOT NULL,
    descripcion TEXT,
    id_creador INT NOT NULL
);

CREATE TABLE IF NOT EXISTS comentGrupos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario TEXT NOT NULL,
    id_us INT NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_us) REFERENCES Usuarios(id) ON DELETE CASCADE    
);

CREATE TABLE IF NOT EXISTS intGrupos(
    id_grupo INT NOT NULL,
    id_us INT NOT NULL,
    PRIMARY KEY (id_grupo, id_us),
    FOREIGN KEY (id_us) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS imgExternas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    urlApi VARCHAR(250) NOT NULL,
    idImg INT NOT NULL
);

CREATE TABLE IF NOT EXISTS ImgGrupos(
    id_grupo INT NOT NULL,
    id_img INT NOT NULL,
    tipoImagen VARCHAR(120),
    PRIMARY KEY (id_grupo, id_img),
    FOREIGN KEY (id_grupo) REFERENCES grupos(id) ON DELETE CASCADE
);
";

//Cierre de conexion
if (!$conexion->multi_query($consulta)) {
    die("Error al crear las tablas: " . $conexion->error);
}