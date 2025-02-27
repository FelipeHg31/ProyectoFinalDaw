import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GruposComponent } from '../grupos/grupos.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-nuevo-grupo',
  templateUrl: './nuevo-grupo.component.html',
  styleUrl: './nuevo-grupo.component.css'
})
export class NuevoGrupoComponent {

  //Declaracion de los objetos y variables
  formulario:FormGroup;
  idUS: number;
  nuevoGrup: any={
    nombre:"",
    descripcion:"",
    id_creador:""
  }
  nuevoInt:any={
    id_grupo:0,
    id_us:0
  }


  constructor(
    private form: FormBuilder, public dialogRef: MatDialogRef<GruposComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number}, private api:ApiService)
    {
      //Obtenems el id proveniente del componente principal
      this.idUS = data.id;
      this.formulario = this.form.group({
        nombre:["", Validators.required],
        descripcion:["", Validators.required]
      })
    }

    hasError(controlName:string, errorName:string){
      return this.formulario.get(controlName)?.hasError(errorName) && this.formulario.get(controlName)?.touched;
    }

    //Metodo para ingresar el nuevo grupo
    EnviarDatos(){
      this.nuevoGrup.nombre = this.formulario.get("nombre")?.value;
      this.nuevoGrup.descripcion = this.formulario.get("descripcion")?.value;
      this.nuevoGrup.id_creador = this.idUS;
      this.api.subirGrupos(this.nuevoGrup).subscribe(
        (resp)=>{
          const idCreado = resp.id;
          console.log("se cre el grupo", idCreado);
          this.nuevoInt.id_grupo = idCreado;
          this.nuevoInt.id_us = this.idUS;
          this.api.subirIntGrupos(this.nuevoInt).subscribe(
            (resp)=>{
              console.log("Se ingreso usuario al grupo");
            },
            (error)=>{
              console.log("No metio integrante al grupo")
            }
          );
        },
        (error)=>{
          console.log("No se creo el grupo");
        }
      )

      this.dialogRef.close();
    }
}
