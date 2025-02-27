import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { response } from 'express';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {

  //Se declaran los diferentes objetos y variables
  formulario: FormGroup;
  tipoDato: string;
  idDato: number;
  idDato2:number=0;

  Categorias: string[] = [];
  Usuarios:any[] = []
  Autores: any[] = [];
  Fotos: any[] = [];
  Resenas:any[] = [];
  Grupos:any[] = [];
  ImgExternas:any[] = [];
  IntGrupos: any[] = [];
  ImgGrupos: any[] = [];
  ComentGrupos: any[] = [];

  Us: any = {
    nombre: "",
    correo: "",
    rol: "",
    password:""
  }
  lib: any = {
    titulo: "",
    id_autor: 0,
    categoria: "",
    descripcion:"",
    id_sube:0,
    imagen:""
  }
  Aut: any = {
    nombre:""
  }
  Res:any={
    comentario:"",
    puntuacion:0,
    id_foto:0,
    id_autor:0
  }
  imgExt:any={
    urlApi:"",
    idImg:0
  }
  grupo:any={
    nombre:"",
    descripcion:"",
    id_creador:0
  }
  imgGrupo:any={
    id_grupo:"",
    id_img:"",
    tipoImagen:0
  }
  intGrupo:any={
    id_grupo:"",
    id_us:""
  }
  comentGrupo:any={
    comentario:"",
    id_us:"",
    id_grupo:0
  }

  imagen:any;

 nomVal:string = "";


  //Se declaran las clases a usar y se obtiene los datos enviados a traves de url
  constructor(
    private form: FormBuilder, public dialogRef: MatDialogRef<EditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {tipoDato: string; id:number; id2?:number}, private api:ApiService) {
    this.idDato = data.id;
    this.tipoDato = data.tipoDato;
    if(data.id2){
      this.idDato2 = data.id2;
    }
    this.formulario = this.form.group({});
  }

  //Se crea el formulario necesario para el dato que se quiera editar
  ngOnInit(): void {
    this.tipoFormulario();
  }

  //Metodo para obtenr todos los datos de las tablas
  ObtenerDatos(){
    this.api.getCategorias().subscribe(
      (response: any[])=>{
        this.Categorias = response.map(usuario=> usuario.nombre);
      }
    )
    this.api.getUsuarios().subscribe(
      data => {this.Usuarios = data},
      error =>{console.log("Error al cargar los usuarios", error)}
    );

    this.api.getAutores().subscribe(
      data => {this.Autores = data},
      error =>{console.log("Error al cargar los autores", error)}
    );

    this.api.getFotos().subscribe(
      data => {this.Fotos = data},
      error =>{console.log("Error al cargar los libros", error)}
    );

    this.api.getResena().subscribe(
      data => {this.Resenas = data},
      error =>{console.log("Error al cargar los reseñas", error)}
    );

    this.api.getGrupos().subscribe(
      data => {this.Grupos = data},
      error =>{console.log("Error al cargar los reseñas", error)}
    );

    this.api.getImgExter().subscribe(
      data => {this.ImgExternas = data},
      error =>{console.log("Error al cargar los reseñas", error)}
    );
  }

  //Metodo para declarar los campos del formulario segun la tabla.
  tipoFormulario(){
    
    switch (this.tipoDato){
      case "usuarios": 
        this.formulario = this.form.group({
          nombre: [],
          correo: [],
          password:[],
          rol: []
        });
      break;

      case "fotos":
        this.formulario = this.form.group({
          titulo: [],
          categoria:[],
          descripcion: [],
          id_sube: [],
          id_autor:[],
          imagen:[]
        });
      break;

      case "autores":
        this.formulario = this.form.group({
          nombre: []
        });
      break;

      case "resenas":
        this.formulario = this.form.group({
          comentario: [''],
          puntuacion:[''],
          id_sube: [0],
          id_foto:[0],
          id_imgExt:[0]
        });
      break;

      case "imgExt":
        this.formulario = this.form.group({
          UrlApi: [''],
          id_imgExt:[0],
        });
      break;

      case "grupos":
        this.formulario = this.form.group({
          nombre: [''],
          descripcion:[''],
          id_grupo:[0],
          id_sube: [0]
        });
      break;

      case "imgGrupos":
        this.formulario = this.form.group({
          id_grupo: [''],
          id_foto:[0],
          id_imgExt:[0],
          tipoImagen: [0]
        });
      break;

      case "comentGrupos":  
      this.formulario = this.form.group({
        comentario: [''],
        id_sube:[0],
        id_grupo: [0]
      });
      break;
    }
  }

  //Se guardan los cambios realizados y se editan en la base de datos
  guardarCambios(tipo:string) {
    switch(tipo){
      case "usuarios":
        this.Us.nombre = this.formulario.get("nombre")?.value;
        this.Us.correo = this.formulario.get("correo")?.value;
        this.Us.rol = this.formulario.get("rol")?.value;
        this.Us.password = this.formulario.get("password")?.value;
        this.api.EditUsuario(this.idDato, this.Us).subscribe(
          response=>{
          console.log("se ingreso");
        },
        error=>{
          console.log("Error al ingresar", error )
        });
      break;
      case "autores":
        this.Aut.nombre = this.formulario.get("nombre")?.value;
        this.api.EditAutores(this.idDato, this.Aut).subscribe(
          response=>{
          console.log(this.Aut, "se ingreso");
        },
        error=>{
          console.log("Error al ingresar", error )
        })
      break;
      case "fotos":
        this.lib.titulo = this.formulario.get("titulo")?.value;
        this.lib.categoria = this.formulario.get("categoria")?.value;
        this.lib.descripcion = this.formulario.get("descripcion")?.value;
        this.lib.id_sube = this.formulario.get("id_sube")?.value;
        this.lib.id_autor = this.formulario.get("id_autor")?.value;

        this.api.EditarFoto(this.idDato, this.lib).subscribe(
          response => {
            console.log("Foto actualizada correctamente", response);
          },
          error => {
            console.log("Error al actualizar la foto", error);
          }
        );
      break;
      case "resenas":
        this.Res.comentario = this.formulario.get("comentario")?.value;
        this.Res.puntuacion = this.formulario.get("puntuacion")?.value;
        this.Res.id_autor = this.formulario.get("id_sube")?.value;
        const fot = this.formulario.get("id_foto")?.value;
        if(fot){
          this.Res.id_foto = this.formulario.get("id_foto")?.value;
        }else{
          this.Res.id_foto = this.formulario.get("id_imgExt")?.value;
        }
        

        //En los datos enviados  para editar la reseña se encontraban problemas con los vacios por lo que me aseguro de si no  
        if (!this.Res.comentario) {
          this.Res.comentario = null;  
        }
        if (!this.Res.puntuacion) {
          this.Res.puntuacion = null;  
        }
        if (this.Res.id_autor === 0) {
          this.Res.id_autor = null;  
        }
        if (this.Res.id_foto === 0) {
          this.Res.id_foto = null;          }

        // Enviar los datos
        this.api.EditResena(this.idDato, this.Res).subscribe(
          response => {
            console.log("Reseña actualizada correctamente", response);
          },
          error => {
            console.log("Error al actualizar la reseña", error);
          }
        );
        break;

      case "imgExt":
       this.imgExt.urlApi = this.formulario.get("UrlApi")?.value;
       this.imgExt.idImg = this.formulario.get("id_imgExt")?.value;

       console.log(this.imgExt);

       this.api.EditImgExter(this.idDato, this.imgExt).subscribe(
        response => {
          console.log("Imagen externa actualizada correctamente", response);
        },
        error => {
          console.log("Error al actualizar la Imagen externa", error);
        }
      );
      break;

      case "grupos":
        this.grupo.nombre = this.formulario.get("nombre")?.value;
        this.grupo.descripcion = this.formulario.get("descripcion")?.value;
        this.grupo.id_creador = this.formulario.get("id_sube")?.value;

        console.log(this.grupo);
        this.api.EditGrupos(this.idDato, this.grupo).subscribe(
          response => {
            console.log("Grupo actualizado correctamente", response);
          },
          error => {
            console.log("Error al actualizar el grupo", error);
          }
        );
      break;

      case "imgGrupos":
        this.imgGrupo.id_grupo = this.idDato;
        this.imgGrupo.id_img = this.idDato2
       
        this.imgGrupo.tipoImagen = this.formulario.get("tipoImagen")?.value;
        
        this.api.EditImgGrupos(this.idDato, this.imgGrupo).subscribe(
          response => {
            console.log("Imagen externa actualizada correctamente", response);
          },
          error => {
            console.log("Error al actualizar la Imagen externa", error);
          }
        );
      break;

      case "comentGrupos":  
        this.comentGrupo.comentario = this.formulario.get("comentario")?.value;
        this.comentGrupo.id_us = this.formulario.get("id_sube")?.value;
        this.comentGrupo.id_grupo = this.formulario.get("id_grupo")?.value;

        this.api.EditComentGrupo(this.idDato, this.comentGrupo ).subscribe(
          response => {
            console.log("Imagen externa actualizada correctamente", response);
          },
          error => {
            console.log("Error al actualizar la Imagen externa", error);
          }
        );
      break;

    }
    this.dialogRef.close(this.formulario.value); // Envía los datos actualizados al componente padre
  }

  //Metodo para subir la imagen 
  GuardarArchivoSubido(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.lib.imagen = reader.result as string; // Guarda la portada en Base64 directamente
      };
      reader.readAsDataURL(file);
    }
  }

  //Metodo para cerrar el modal y recargar los datos
  cerrar() {
    this.ObtenerDatos();
    this.dialogRef.close();
  }

}
