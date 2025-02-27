import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { GruposComponent } from '../grupos/grupos.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-descp-comentarios',
  templateUrl: './descp-comentarios.component.html',
  styleUrl: './descp-comentarios.component.css'
})
export class DescpComentariosComponent {

  //Declaracion de varibales y objetos
  comentarios:any[] = [];
  imagen:any;
  idImg:number=0;
  tipo:string="";
  formulario:FormGroup;

  //Declaracion de clases, servicios y inyecciones al modal
  constructor(private form:FormBuilder, public dialogRef: MatDialogRef<GruposComponent>,@Inject(MAT_DIALOG_DATA) public data: {id:number, tipo:string}, private api:ApiService){
    
    //Se guardan los datos
    this.tipo = data.tipo;
    this.idImg = data.id;

    this.formulario = this.form.group({
      descp:[""]
    })
  }

  ngOnInit(): void {

    //Obtenemos las reseña de la imagen
    this.api.getResena().subscribe(
      (response)=>{
        this.comentarios = response;
        this.comentarios = this.comentarios.filter(res=> res.id_img == this.idImg);
        console.log(this.comentarios);
      },
      (error)=>{
        console.log(error);
      }
    );

    //Si la imagen proviene de la base de datos obtenemos la descripción de la imagen.
    if(this.tipo == "local"){
      this.api.getFotos().subscribe(
        (response)=>{
          const imagenes = response;
          this.imagen = imagenes.filter((res:{id:number})=> res.id == this.idImg);
          this.formulario.get("descp")?.setValue(this.imagen[0].descripcion);
        }
      )
    }else{

    }
   
  }



}
