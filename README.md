# Nuesfot 📸

Plataforma web full-stack de gestión y visualización de imágenes desarrollada como Trabajo de Fin de Grado del ciclo superior de Desarrollo de Aplicaciones Web (DAW).

---

## Descripción

Nuesfot permite a los usuarios subir, organizar y visualizar imágenes a través de una interfaz web moderna. El sistema está construido con una arquitectura cliente-servidor, donde el backend expone una API REST que el frontend consume de forma asíncrona.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular · TypeScript · HTML · CSS |
| Backend | PHP · API REST |
| Base de datos | MySQL |
| Control de versiones | Git |

---

## Estructura del proyecto

```
ProyectoFinalDaw/
├── BackEnd/                  # API REST en PHP
├── FrontEnd/
│   └── fotosApp/             # Aplicación Angular
├── Manual de usuario Nuesfot.pdf
└── HernandezGarciaJuanFelipeProyectoFinal.pdf   # Memoria del proyecto
```

---

## Funcionalidades principales

- Subida y almacenamiento de imágenes
- Visualización y navegación por galería
- Comunicación frontend-backend mediante endpoints REST
- Gestión de datos desde interfaz web

---

## Instalación y puesta en marcha

### Requisitos previos

- PHP 8.x
- Node.js y npm
- MySQL
- Angular CLI (`npm install -g @angular/cli`)

### Backend

```bash
cd BackEnd
# Importar la base de datos en MySQL
# Configurar las credenciales de conexión en el archivo de configuración
# Levantar el servidor PHP
php -S localhost:8000
```

### Frontend

```bash
cd FrontEnd/fotosApp
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

---

## Documentación

- 📄 [Memoria del proyecto](./HernandezGarciaJuanFelipeProyectoFinal.pdf) — descripción técnica completa, decisiones de diseño y arquitectura.
- 📘 [Manual de usuario](./Manual%20de%20usuario%20Nuesfot.pdf) — guía de uso de la aplicación.

---

## Autor

**Juan Felipe Hernández García**  
[GitHub](https://github.com/FelipeHg31) · Madrid, España

---

> Proyecto académico — FP Superior DAW · 2023–2025
