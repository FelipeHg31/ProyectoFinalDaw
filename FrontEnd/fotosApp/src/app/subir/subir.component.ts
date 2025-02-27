import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';
import { DatosIngresoService } from '../us-ing.service';


@Component({
  selector: 'app-subir',
  templateUrl: './subir.component.html',
  styleUrl: './subir.component.css'
})
export class SubirComponent {
 
  //Declaración de objetos y variables
  FotoNueva: any = {
    titulo: '',
    id_autor: '',
    categoria: '',
    descripcion: '',
    idUsSube: '',
  };

  FotImg: any = {
    imagen:''
  }

  titulos:string[] = [];
  autores: string[] = [];
  idAutores: number[] = [];
  Categorias:string[]=[];

  nuevoAutor:boolean = false;

  formulario: FormGroup;

  constructor(private form:FormBuilder, private api:ApiService, private route:Router, private ing:DatosIngresoService){
    
    //Declaramos al formulario
    this.formulario = this.form.group({
      titulo: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
      autor: ["", [Validators.required, Validators.minLength(4)]],
      descripcion: ["", [Validators.required, Validators.minLength(15)]],
      autorNuev:[""],
      imagen:[null, [Validators.required]]
    })
  }
  
  ngOnInit(): void {

    //Obtenemos las fotos, autores, categoria y el usuario ingresado
    this.api.getFotos().subscribe(
      (response: any[])=>{
        this.titulos = response.map(foto=> foto.titulo);
      }
    )
    //Se resetea el formulario
    this.formulario.reset();
    this.obtAutores();
    this.ing.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    }); 

    this.api.getCategorias().subscribe(
      (response: any[])=>{
        this.Categorias = response.map(usuario=> usuario.nombre);
      }
    )
  }

  //Se declara el objeto del autor para subirlo
  autorData = {
    nombre: ""
  }

  usuario:any ;

  nuevoAut(){
    this.nuevoAutor = true;
  }

  //Metodo para obtener los autores
  obtAutores(){
    this.api.getAutores().subscribe(
      (response: any[])=>{
        this.autores = response.map(autor=>autor.nombre);
        this.idAutores = response.map(autor=>autor.id);
      },
      (error:any)=>{
        console.log("Error de autores", error);
      }
    );
  }

  //Metodo para crear un nuevo autor 
  IngnuevoAut(){
    this.autorData.nombre = this.formulario.get("autorNuev")?.value.toUpperCase();

    if(this.autorData.nombre == "YO"){
      this.autorData.nombre = this.usuario.nombre;
    }

    if(!this.autores.includes(this.autorData.nombre)){
      this.api.subirAutores(this.autorData).subscribe(
        response =>{
          console.log("Autor creado", response);
          alert("El autor ha sido creado");
          
        },
        error=>{
          console.log("Autor no creado", error);
        }
      );
    }else{
      alert("El nombre del autor ya esta en la base de datos, cambialo porfavor"); 
    }
  }

  //Metodo para guardar los datos del formulario
  guardarDatos() {
    console.log(this.usuario);
    // Obtener los valores de los campos del formulario
    this.FotoNueva.titulo = this.formulario.get("titulo")?.value;
    let idAu = this.autores.indexOf(this.formulario.get("autor")?.value);
    this.FotoNueva.id_autor = this.idAutores[idAu];
    this.FotoNueva.categoria = this.formulario.get("categoria")?.value;
    this.FotoNueva.descripcion = this.formulario.get("descripcion")?.value;
    this.FotoNueva.idUsSube = this.usuario.id;
   }

   //Metodo para obtener los datos de la imagen y codificarlos en base 64
   GuardarArchivoSubido(event: any) {
    const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.FotImg.imagen = reader.result as string;
      };
      //Convertimos los datos de la imagen en un objeto que se pueda pasar por url
      reader.readAsDataURL(file);
    }

//Metodo para guardar la imagen subida al revisar los datos del formulario
EnviarDatos() {
    if (this.formulario.valid) {
      this.guardarDatos();
      if(!this.titulos.includes(this.FotoNueva.titulo)){
        this.api.subirFotos(this.FotoNueva).subscribe(
          response => {
            const id = response.id_foto;
            this.api.EditarFoto(id, this.FotImg).subscribe(
              response=>{
                console.log("Foto editada");
                alert("La foto se subio correctamente");
              },
              error=>{
                console.log("foto no editada");
              }
            )
          },
          error => {
            console.log("Error al registrar la foto", error);
          }
        );
      }else{
        alert("El titulo de la imagen ya existe, cambialo por favor")
      }
     
    }
}


  hasError(controlName:string, errorName:string){
    return this.formulario.get(controlName)?.hasError(errorName) && this.formulario.get(controlName)?.touched;
  }

limpiar(){
  this.formulario.reset();
}
}
