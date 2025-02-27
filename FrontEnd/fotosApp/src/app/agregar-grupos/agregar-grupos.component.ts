import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { DatosIngresoService } from '../us-ing.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { GruposComponent } from '../grupos/grupos.component';
import { ActivatedRoute } from '@angular/router';
import { ImgExternasService } from '../img-externas.service';

@Component({
  selector: 'app-agregar-grupos',
  templateUrl: './agregar-grupos.component.html',
  styleUrl: './agregar-grupos.component.css'
})
export class AgregarGruposComponent {

  //Se declaran los objetos y varibales autilizar
  formulario:FormGroup;
  idGrupos:number[] = [];
  esta:boolean = false;
  EstaLaImagen:boolean = false;
  imgENueva:any={
    urlApi:"",
    idImgExt:0
  }

  imgECons:any={
    src:""
  }
  grupos:any[] = [];
  nuevo:any={
    id_grupo:0,
    id_img:0,
    tipoImagen:""
  }
  estaGrupos:number[] = [];
  usuario:any;
  id_img:number;
  id_us:number;
  tipo:string;

  //Se declara el formulario, las clases y los servicios a utilizar 
  constructor(private form:FormBuilder, private imgExt: ImgExternasService, private ingreso:DatosIngresoService, public dialogRef: MatDialogRef<GruposComponent>,  @Inject(MAT_DIALOG_DATA) public data: {id:number, tipo:string, idUs:number}, private api:ApiService){
    this.formulario = this.form.group({
      selGroup:[""]
    });
    //Obtenemos los datos pasados al modal
    this.id_img = data.id;
    this.tipo = data.tipo;
    this.id_us = data.idUs;
  }

  //Obtenemos los datos del usaurios ingresado
  ngOnInit(): void {
    this.ingreso.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    this.api.getIntGrupos().subscribe(
      (resp)=>{
        const datos = resp.filter((d:{id_us:number})=>d.id_us == this.id_us);
        const idUs = datos.map((id:{id_grupo:number})=>id.id_grupo);
        console.log(idUs);

         //Obtenemos los grupos en los que no esta la imagen
        this.api.getImgGrupos().subscribe(
          (resp)=> {
            const data = resp.filter((d:{id_img:number})=>d.id_img == this.id_img);
            const ids = data.map((id:{id_grupo:number})=>id.id_grupo);
            this.estaGrupos = ids;
            this.api.getGrupos().subscribe(
              (resp)=>{
                const datos = resp.filter((d:{id:number})=> !this.estaGrupos.includes(d.id));
                const final = datos.filter((d:{id:number})=> idUs.includes(d.id));
                console.log(final);
                this.grupos = final;
              }
            )
          },
          (error)=>{
            console.log(error);
          }
        );
      },
      (error)=>{
        console.log(error);
      }
    );

   

    //Si la imagen visualizada es externa se revisara si la imagen esta guardad en la base de datos anteriormente
    if(this.tipo == "externa"){

      this.api.getImgExter().subscribe(
        (resp)=>{
          const esta = resp.find((d:{idImg:number})=>d.idImg == this.id_img);
          if(esta){
            this.EstaLaImagen = false;
  
          }else{
            this.EstaLaImagen = true;
          }
        }
      );  
    }

  } 

  //Metodo para agregar la imagen a la base de datos
  agregar(){ 
    const idG = this.formulario.get("selGroup")?.value;
    this.nuevo.id_grupo = idG;
    this.nuevo.id_img = this.id_img;
    this.nuevo.tipoImagen = this.tipo;

    //Se sube la imagen al grupo
    this.api.subirImgGrupos(this.nuevo).subscribe(
      (resp)=>{
        console.log("Se subio la imagen");

        //Si no esta la imagen externa se guarda
        if(this.tipo == "externa" && this.EstaLaImagen){
          this.imgExt.getImageById(this.id_img).subscribe(
            (resp) =>{
              
              this.imgECons = resp;
              this.imgENueva.urlApi = this.imgECons.src.original;
              this.imgENueva.idImgExt = this.id_img;

              console.log(this.imgENueva);
              this.api.subirImgExter(this.imgENueva).subscribe(
                (response)=>{
                  console.log("Se creo la img ext", response);
                },
                (error)=>{
                  console.log("No se creo la img ext", error);
                }
              );
            }
          );
          
        }else{
          console.log("No se ve el tipo");
        }
        
        this.dialogRef.close();

      },
      (error)=>{
        console.log("ne subio la imagen");
      }
    );

  }

  //Metodo para cerrar el modal
  cerrar() {
    this.dialogRef.close();
  }


}
