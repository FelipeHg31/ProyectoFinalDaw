import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { error, log } from 'node:console';
import { DatosIngresoService } from '../us-ing.service';
import { ImgExternasService } from '../img-externas.service';
import { truncate } from 'node:fs';

@Component({ 
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //Se declara el formulario
  formulario: FormGroup;

  //Se crea un array con clave y valor el cual se crea a partir de las imagenes que aparezcan en la pantalla.
  //Para poder diferenciarlas y poder cambiarles el tamaño
  tamimg: {[key:number]:number} = {};

  constructor(private form:FormBuilder, private apiService:ApiService, private ingreso: DatosIngresoService, private externo: ImgExternasService){
    //Se declaran los nombres de los campos del formulario
    this.formulario = this.form.group({
      nomBusq:[""],
      catBusq:[""],
      autorBusq:[""]
    })
  }

  //Declaracion de las diferentes variables que se usaran para obtener los datos de la base de datos. 
  fotosCambio: any[] = [];
  fotos: any[] = [];
  fotosExternas: any[] = [];
  fotosExternasBusq:any[] = [];
  Categorias:any[]=[];
  Autores:any[] = [];
  usua :any;
  idUs:number = 0;
  estanLoc:boolean = false;
  estanExt:boolean = false;


  ngOnInit(): void {

    //Obtenemos la información inicial a mostrar
    setTimeout(()=>{
      this.obtFotos();
    },300)

    setTimeout(()=>{
      this.obtFotosExt();
    },300)
   
    //Se hace llamado al documento de usuario para saber si el cliente se ha registrado o no. Usando el servicio DatosIngresoService
    this.ingreso.usuario$.subscribe(usuario => {
      this.usua = usuario;
    }); 
    
    //Se hace un llamado al script api.php para pedir la informacion de cada tabla. Usando el servicio ApiService
    this.apiService.getCategorias().subscribe(
      (response: any[])=>{
        this.Categorias = response;
      }
    )
    this.apiService.getAutores().subscribe(
      (response: any[])=>{
        this.Autores = response;
      }
    )


  }
  
  //Metodo para obtener una cantidad de fotos desde la API externa. Usando el serivicio ImgExternasService
  obtFotosExt(){
    this.externo.getImages('random',30,1).subscribe(
      (resp:any)=>{
        this.fotosExternas = resp.photos;  
        this.estanExt = true;
      },
      (error)=>{
        console.log("No se cargo los datos de la api", error);
      }
    );
  }

  //Metodo para pedir las imagenes guardadas en la base de datos. Usando el servicio ApiService
  obtFotos(){
    this.apiService.getFotos().subscribe(
      (data)=>{
        this.fotos = data;
        this.fotosCambio = this.fotos;
        console.log(this.fotos);
        this.estanLoc = true;
      },
      (error)=>{
        console.log("Error al obtener las fotos", error);
      }
    )
    console.log(this.fotos);
  }

  //Se crea un objeto para el formulario
  public busqueda:any = {
    nombre:"",
    categoria: "",
    comentario: ""
  }

  //Metodo para buscar dentro de las imagenes almacenadas en la base de datos el nombre ingresado en el formulario
  Buscar(){
      this.fotosCambio = this.fotos.filter(foto=> foto.titulo == this.formulario.get("nomBusq")?.value);
      this.fotosExternas = [];
  }

  //Metodo con el cual se hara un filtro en los datos mostrados segun el campo del formulario en donde haya ocurrido la acción
  busqSelect(tipo:string){
    switch(tipo){
      case "autores":
          this.fotosCambio = this.fotos.filter(foto=> foto.id_autor == this.formulario.get("autorBusq")?.value);
          this.fotosExternas = [];
      break;
        
      case "categorias":
        this.estanLoc = false;
        this.estanExt = false;
        setTimeout(()=>{
          this.fotosCambio = this.fotos.filter(foto=> foto.categoria == this.formulario.get("catBusq")?.value);
          this.busqFotosExt();
          this.estanLoc = true;
          this.estanExt = true;
        },300);
        
      break;
    }
  }

  //Metodo para buscar imagenes de la API externa de una categoria especifica.
  busqFotosExt(){
    this.externo.getImages(this.formulario.get("catBusq")?.value,30,1).subscribe(
      (resp:any)=>{
        this.fotosExternas = resp.photos;   
        this.estanExt = true;
        console.log(this.fotosExternas);
      },
      (error)=>{
        console.log("No se cargo los datos de la api", error);
      }
    );
    
  }

  //Metodo para agrandar la imagen segun el mouse este dentro de la imagen
  grande(id:number){
    this.tamimg[id] = 250;
  }

  //Metodo para volver al tamaño original la imagen
  pequeno(id:number){
    this.tamimg[id] = 180;
  }

  limpiar(){
    this.estanLoc = false;
    this.estanExt = false;
    this.formulario.reset();
    setTimeout(()=>{
      this.obtFotos();
    },300)

    setTimeout(()=>{
      this.obtFotosExt();
    },300)
  }

}
