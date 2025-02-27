import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { DatosIngresoService } from '../us-ing.service';
import { Resena } from './interfaceRes';
import { response } from 'express';
import { error } from 'console';
import { link } from 'fs';
import { AgregarGruposComponent } from '../agregar-grupos/agregar-grupos.component';
import { MatDialog } from '@angular/material/dialog';
import { ImgExternasService } from '../img-externas.service';
import { DescpComentariosComponent } from '../descp-comentarios/descp-comentarios.component';
import { DescargarService } from '../descarga.service';
import { HttpClient } from '@angular/common/http';
import {HostListener } from '@angular/core';

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrl: './foto.component.css'
})

export class FotoComponent implements OnInit{

  //Declaracion de variables y objetos
    listResena : any[] = [];
    resenaUnica: Resena = {
      id:0,
      comentario:"",
      id_autor: 0,
      puntuacion: 0,
      id_img: 0
    };
    Fotos: any[] = [];
    fotosExternas:any[] = [];
    NoestaExterna:boolean = true;
    fot:any = [];
    titulo:string ="";
    img:any;
    tamW: number = 350;
    tamH: number = 550;
    resenaNueva: any = {
      comentario:"",
      id_autor: null,
      puntuacion:0,
      id_img:null
    }
    imgExterNueva:any={
      urlApi:"",
      idImgExt:0
    }
    imagenExterna:any;
    idUs:number = 0;
    idRes:number = 0;
    idImg:number = 0;
    tipo:string = "";
    ingresado:boolean = false;
    tieneRes:boolean = false;
    formulario: FormGroup;
    puntua:number = 0;
    tam:number = 0;
  
    //Se declaran el formulario, los servicios y clases necesarias.
    constructor(private form:FormBuilder, private api:ApiService, private router: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, 
    private imgExt: ImgExternasService, private dialog:MatDialog, private desc:DescargarService, private http: HttpClient){
      this.formulario = this.form.group({
        ancho:[0],
        alto:[0],
        puntua:[0],
        comentario:[""]
      })
    }
  
    ngOnInit(): void {
      //Borramos los datos del formulario
      this.formulario.reset();
      
      //Recibimos los datos enviados desde la url con el tipo de imagen, id imagen y id usuario si este existe.
      this.router.paramMap.subscribe(params => {
        const idParam = params.get('idUs');  
        const idFot = params.get('id');
        //Verificamos la existencia
        if (idParam) {
          this.idUs = +idParam;
          this.ingresado = true;
        } else if(idFot) {
          this.idImg = +idFot;
        } else{
          this.idUs = 0;
          this.ingresado = false;
        }
      });
     
      //Obtenemos las diferentes resenas de la imagen y si el usuario esta registrado se busca la reseñaa especifica
      this.api.getResena().subscribe(
        (response)=>{
          this.listResena = response;
          this.router.params.subscribe(params => {
          this.listResena = this.listResena.filter(res=> res.id_img == params["id"]);
            if(this.ingresado){
              this.saberIngreso();
            }
          });
        }
      )
      
      //Obtenemos el tipo de la imagen. Se obtiene despues debido a que se pierde el valor del dato.
      this.router.params.subscribe(params => {
        this.tipo = params["tipo"];
      });
      
      if(this.tipo == "local"){
      //Espera a que las fotos se carguen antes de buscar la imagen específica
        this.api.getFotos().subscribe(
          (data) => {
            this.Fotos = data;
    
            //Se vuelven a obtener los datos debido a que se pierde el valord de estos.
            this.router.params.subscribe(params => {
              this.fot = this.Fotos.find(fot => fot.id == params["id"]);
              this.titulo = this.fot?.titulo;
              this.img = this.fot?.imagen;
    
              //Si existe la imagen se obtienen las dimensiones y se ajusta para poder mostrarla
              if (this.img) {
                this.obtDimensiones(this.img);
              }
            });
          },
          (error) => {
            console.log("Error al cargar los fotos", error);
          }
        );
      }else{
        //Si es de tipo externa obtenemos la imagen desde la API
        this.router.params.subscribe(params => {
          this.idImg = params["id"];
        });
       
        //Obtenemos la imagen de la api
        this.imgExt.getImageById(this.idImg).subscribe(
          (resp)=>{
            this.imagenExterna = resp;
          },
          (error)=>{
            console.log("No se encontro imagen en la api");
          }
        );

        //Se verifica si la imagen esta en la base de datos y se guarda la respuesta en NoestaExterna 
        this.api.getImgExter().subscribe(
          (resp)=>{
            const esta = resp.find((d:{idImg:number})=>d.idImg == this.idImg);
            if(esta){
              this.NoestaExterna = false;
              console.log("Esta la imagen guardada");

            }else{
              this.NoestaExterna = true;
              console.log("No esta la imagen");
            }
          }
        );
      }
    }

    //Metodo para obtener las dimensiones de la imagen y ajustarlas
    obtDimensiones(img64: string) {
      //Se verifica que la app esta en un navegador
      if (isPlatformBrowser(this.platformId)) { 
        //Se crea el objeto de la imagen y se le pasa la imagen.
        const imag = new Image();
        imag.src = 'data:image/jpeg;base64,' + img64;

        //Al cargar la imagen si las medidas de esta superan los 700 pixeles se ajuzta al maximo 
        imag.onload = () => {  

          if(imag.height>700){
            this.tamH = 700;
          }else{
            this.tamH = imag.height;
          }

          if( (window.innerWidth >= 900) && imag.width>700)
            {
              this.tamH = 700;
              this.tamW  =700;

            }else if(window.innerWidth <= 900)
              {
                this.tamH = 350;
                this.tamW  =350;
              }else if(window.innerWidth <= 600)
                {
                  this.tamH = 300;
                  this.tamW  =300;
                }
        };
      }
    }

    //Metodo para la imagen de la dimensiones de la imagen obtenida desde la API
    obtDimensionesExt(url:string): Promise<{ width: number; height: number }>{
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = url;
      });
    }

    //Metodo para pasar los datos al metodo obtDimensionesExt
    anchoAlto(url:string){
      this.obtDimensionesExt(url).then(
        tam=>{
          this.tamH = tam.height;
          this.tamW = tam.width
        });
    }

    //Metodo para ajustar las dimensiones
    cambiarTam(){
      const ancho = this.formulario.get("ancho")?.value;
      const alto = this.formulario.get("alto")?.value;
      
      if(window.innerWidth >= 900)
        {
          this.tam = 700;
        }else if(window.innerWidth <= 900)
          {
            this.tam = 500;
          }else if(window.innerWidth <= 600)
            {
              this.tam = 350;
            }

      if(ancho>this.tam){
        this.tamW = this.tam;
      }else{
        this.tamW = ancho;
      }
      if(alto>this.tam){
        this.tamH = this.tam;
      }else{
        this.tamH = alto;
      }
    }

    //Metodo para guardar los datos del formulario en variables
    guardarCambios(){
      this.resenaNueva.comentario = this.formulario.get("comentario")?.value;
      this.resenaNueva.puntuacion = this.formulario.get("puntua")?.value;
    }

    //Metodo para encontrar la resena especifica para la imagen y el usuario registrado
    saberIngreso(){
      //Se revisa si hay más de una resena
      if (Array.isArray(this.listResena)) {

        //Se busca la resena que este hecha por el usuario registrado
        const esta = this.listResena.find(res=>res.id_autor == this.idUs);
        if(esta){

          //Se actualizan los datos
          this.idRes = esta.id;
          this.resenaNueva.puntuacion = esta.puntuacion;
          this.formulario.get('puntua')?.setValue(esta.puntuacion);
          this.formulario.get('comentario')?.setValue(esta.comentario);
          this.tieneRes = true;
           
        }else{
          console.log("No existe reseña");
          this.formulario.get('puntua')?.setValue(0);
          this.resenaNueva.puntuacion = 0;
          this.tieneRes = false;
        }
      }else{
        this.resenaUnica = this.listResena;

        //Si solo hay una reseña resvisamos que el id sea el mismo del usuario
        if( this.resenaUnica.id_autor == this.idUs){
          this.idRes = this.resenaUnica.id;
          this.resenaNueva.puntuacion = this.resenaUnica.puntuacion;
          this.formulario.get('puntua')?.setValue(this.resenaUnica.puntuacion);
          this.formulario.get('comentario')?.setValue(this.resenaUnica.comentario);
          this.tieneRes = true;
        }else{
          console.log("No hay reseña individual");
          this.tieneRes = false;
          this.formulario.get('puntua')?.setValue(0);
          this.resenaNueva.puntuacion = 0;
        }
          
      }
    }

    //Metdodo para guardar la puntuacion que el usuario haga el momento. Se guarda con el cambio en el controlador
    cambio(){
      this.resenaNueva.puntuacion = this.formulario.get("puntua")?.value;
    }

    //Metodo para agregar o modificar la reseña del usuario sobre la imagen
    agreEditResena(){
      
      this.guardarCambios();

      //Se verifica si ya existe reseña hecha por el usuario
      if(this.tieneRes){
        //Se modifica el dato en la tabla
        this.api.EditResena(this.idRes,this.resenaNueva).subscribe(
          (response)=>{
            console.log("reseña fue editada");
          },
          (error)=>{
            console.log("reseña no editada")
          }
        );
      }else{
        
        this.resenaNueva.id_autor = this.idUs;
        
        //Se obtiene de nuevo el id de la imagen debido a que se pierde con los difegentes procesos
        this.router.params.subscribe(params => {
          this.idImg = params["id"];
        });
        this.resenaNueva.id_img = this.idImg;

        //Se crea la reseña
        this.api.subirResena(this.resenaNueva).subscribe(
          (response)=>{
            console.log("reseña fue creada");
          },
          (error)=>{
            console.log("reseña no creada", error)
          }
        );

        //Se verifica si la imagen externa se encuntra en la base de datos sino se guarda
        if(this.tipo == "externa" && this.NoestaExterna){
          this.imgExterNueva.urlApi = this.imagenExterna.src.original;
          this.imgExterNueva.idImgExt = this.idImg;
          this.api.subirImgExter(this.imgExterNueva).subscribe(
            (response)=>{
              console.log("Se creo la img ext", response);
            },
            (error)=>{
              console.log("No se creo la img ext", error);
            }
          );
        }else{
          console.log("No se ve el tipo");
        }
      }
    }

    //Metodo para abrir un modal con la descripcion y los comentarios de la imagen
    abrirComent(){
      this.router.params.subscribe(params => {
        this.idImg= params["id"];
        this.tipo = params["tipo"];
       });
       const id = this.idImg;
       const tipo = this.tipo;
       const abrir = this.dialog.open(DescpComentariosComponent,{
         width: '500px',
         data:{id, tipo}
       });
    }
 
    //Metodo para abrir el modal para agregar la imagen a algun grupo
    agregar(){
      this.router.params.subscribe(params => {
       this.idImg= params["id"];
       this.tipo = params["tipo"];
       this.idUs = params["idUs"];
      });
      const id = this.idImg;
      const tipo = this.tipo;
      const idUs = this.idUs;
      const abrir = this.dialog.open(AgregarGruposComponent,{
        width: '500px',
        data:{id, tipo, idUs}
      });
    }

    descargarImg(){
      switch(this.tipo){
        case "local":
          const datos = {
            imagen:this.img ,
            titulo:this.titulo
          }
    
          console.log(datos);
    
          this.desc.descargaUnica(datos).subscribe(
            (response: Blob) => {
              // Crear una URL para descargar la imagen
              const url = window.URL.createObjectURL(response);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mi_imagen.jpg'; // Nombre del archivo descargado
              a.click();
          
              // Liberar la URL creada
              window.URL.revokeObjectURL(url);
            },
            (error) => {
              console.error('Error al descargar la imagen:', error);
            }
          );
        break;

        case "externa":
          this.http.get(this.imagenExterna.src.original, { responseType: 'blob' }).subscribe(
            (response: Blob) => {
              // Crear una URL para descargar el blob
              const url = window.URL.createObjectURL(response);
      
              // Crear un enlace temporal para descargar
              const a = document.createElement('a');
              a.href = url;
              a.download = 'imagen_descargada.jpg'; // Nombre de archivo para la descarga
              a.click();
      
              // Limpiar la URL creada
              window.URL.revokeObjectURL(url);
            },
            (error) => {
              console.error('Error al descargar la imagen:', error);
            }
          );
        break;
      }
    }

    ajuste(event:any){
      if(event.target.innerWidth <= 900)
        {
          this.tamH = 400;
          this.tamW  =400;
        }else if(window.innerWidth <= 600)
          {
            this.tamH = 300;
            this.tamW  =300;
          }else if(window.innerWidth <= 300)
            {
              this.tamH = 150;
              this.tamW  =150;
            }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.ajuste(event);
    }
  
}


