import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { DatosIngresoService } from '../us-ing.service';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {

  //Se declaran las varibales y los objetos
  comentarios:any[] = [];
  comentN:any={
    comentario:"",
    id_us:0,
    id_grupo:0
  }
  grupos:any[]=[];
  esJefe:boolean = false;
  grupo:any;
  fotosGrupos:any[] = [];
  fg:any[] = [];
  fgE:any[] = [];
  fotos:any[] = [];
  fotosExternas:any[] = [];
  comentGrupos:any[] = [];
  intGrupos:any[] = [];
  idGrupos:any[] = [];
  grupoUsua:number=0;
  usua:any;
  formulario:FormGroup;
  muestra1:boolean = false;
  muestra2:boolean = false;

  //Variable con valor y key para darle tamaños individuales a las imagenes
  tamimg: {[key:number]:number} = {};

  //Se declaran las clases y los servicios 
  constructor(private api:ApiService, private form:FormBuilder,private router:ActivatedRoute, private ingreso: DatosIngresoService){

    this.formulario = this.form.group({
      comentario:[""]
    });
  }

  ngOnInit():void{
    //Se obtione el id del grupo desde la url
    this.router.paramMap.subscribe(params =>{
      const id = params.get("id");
      if(id){
        this.grupoUsua = +id;
      }
    })

    //Se obtiene el usuario registrado
    this.ingreso.usuario$.subscribe(usuario => {
      this.usua = usuario;
    });

    //Se obtienen los grupos, comentarios y las imagenes que estan en el grupo

    this.api.getGrupos().subscribe(
      (resp)=>{
        this.grupo = resp.filter((data:{id:number})=>data.id == this.grupoUsua);
        console.log(this.grupo);
        console.log((this.usua));
        if(this.grupo[0].id_creador == this.usua.id){
          this.esJefe = true;
        }else{
          this.esJefe = false;
        }
      },
      (error)=>{

      }
    );
  
  //Se hace una espera para asegurar que se haga bien la consulta
  setTimeout(() => {
    this.actImgGrupos();
    this.actIntGrupos();
  }, 300);

  this.actComent();
  
  }

  //Metodo para ingresar el comentario al grupo
  comentar(){
    this.comentN.comentario = this.formulario.get("comentario")?.value;
   
    this.comentN.id_us = this.usua.id;
    this.comentN.id_grupo = this.grupoUsua;
    
    if(this.comentN.comentario != ""){
      this.api.subirComentGrupo(this.comentN).subscribe(
        (resp)=>{
          alert("El comentario ha sido subido");
        },
        (error)=>{
          console.log("creo que no se subio", error);
        }
      );
    }

    this.actComent();
  }

  //Metodo para actualizar los comentarios 
  actComent(){
    this.comentarios = [];
    this.api.getComentGrupo().subscribe(
      (resp)=>{
        this.comentarios = resp.filter((data:{id_grupo:number})=>data.id_grupo == this.grupoUsua);
      },
      (error)=>{}
    );
  }

  //Metodo para actualizar los integrantes de los grupos
  actIntGrupos(){
    this.intGrupos = [];
    this.api.getIntGrupos().subscribe(
      (resp)=>{
        this.grupos = resp.filter((data:{id_grupo:number})=> data.id_grupo == this.grupoUsua);
        this.idGrupos = this.grupos.map((data:{id_us:number})=>data.id_us);
        console.log(this.idGrupos);
        this.api.getUsuarios().subscribe(
          (resp)=>{
            this.intGrupos = resp.filter((data:{id:string})=> this.idGrupos.includes(data.id));
          },
          (error)=>{
            console.log("No se pudo ñero");
          }
        );
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  //Metodo para actualizar las imagenes de los grupos
  actImgGrupos(){
    this.fotos = [];
    this.api.getImgGrupos().subscribe(
      (resp)=>{
        this.fotosGrupos = resp.filter((data:{id_grupo:number})=> data.id_grupo == this.grupoUsua);
        const fot = this.fotosGrupos.filter((data:{tipoImagen:string})=> data.tipoImagen == "local");
        this.fg = fot.map((data:{id_img:number})=>data.id_img);
        const fotE = this.fotosGrupos.filter((data:{tipoImagen:string})=> data.tipoImagen == "externa");
        this.fgE = fotE.map((data:{id_img:number})=>data.id_img);
        this.api.getFotos().subscribe(
          (resp)=>{
            this.fotos = resp.filter((data:{id:number})=> this.fg.includes(data.id));
            this.muestra1 = true;
          },
          (error)=>{
            console.log("No se actualizaron las imagenes");
          }
        );

        this.api.getImgExter().subscribe(   
          (resp)=>{
            this.fotosExternas = resp.filter((data:{idImg:string})=> this.fgE.includes(data.idImg));
            this.muestra2 = true;
          },
          (error)=>{
            console.log("No se actualizaron las imagenes externas");
          }
        );
      },
      (error)=>{
        console.log("No se encontraron fotos");
      }
    );

  }

  //Metodo para borrar un comentario o un usuario del grupo
  borrar(tipo:string, id:number, id2?:number){
    switch(tipo){
      case "comentario":
        this.api.deleteComentGrupo(id).subscribe(
          (resp)=>{
            alert("Se borro el comentario");
          },
          (erro)=>{
            console.log("No se borro el comentario");
          }
        );
        this.actComent();
      break;

      case "usuario":

      const idGrupo = this.grupoUsua;

        if(id2){
          console.log(idGrupo, id2);
          this.api.deleteIntGrupos(idGrupo, id2).subscribe(
            (resp)=>{
              alert("Se borro el usario");
            },
            (erro)=>{
              console.log("No se borro el usuario");
            }
          );
        }
        
       this.actIntGrupos();
      break;
    }
  }

  //Metodo para agrandar la imagen segun el mouse este dentro de la imagen
  grande(id:number){
    this.tamimg[id] = 300;
  }

  //Metodo para volver al tamaño original la imagen
  pequeno(id:number){
    this.tamimg[id] = 180;
  }

  borrarImg(idImg:number){
    this.api.deleteImgGrupos(this.grupoUsua, idImg).subscribe(
      response => {
        console.log("Se borro la imagen del grupo correctamente", response);
      },
      error => {
        console.log("Error al borrar la imagen del grupo", error);
      }
    );
    this.actImgGrupos();
  }
}
