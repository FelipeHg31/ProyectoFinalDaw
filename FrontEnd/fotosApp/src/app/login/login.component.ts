import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { DatosIngresoService } from '../us-ing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //Objeto que se guardara en el archivo usuario.json y saber que usuario ha ingresado de forma persistente
  public usuarioIng:any = {
    correo:"",
    rol:"",
    id:0
  }

  formulario: FormGroup;

  CorreoUsuarios: string[] = [];
  ContUsuarios: string[] = [];
  NomUsuarios: string[] = [];
  TipoUsuarios: string[] = [];
  idUsuarios:number[] = [];

  constructor(private form:FormBuilder, private api:ApiService, private ingreso:DatosIngresoService){
    //Se establecen los campos y las reglas de validación
    this.formulario = this.form.group({
      correo: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    })
  }

  ngOnInit(): void {
    this.formulario.reset();

    //Se obtienen los datos de todos los usuarios y poder revisarlos organizanolos en arrays consecutivos para cada campo de la tabla
    this.api.getUsuarios().subscribe(
      (response: any[])=>{
        this.CorreoUsuarios = response.map(usuario=> usuario.correo);
        this.ContUsuarios = response.map(usuario => usuario.password);
        this.NomUsuarios = response.map(usuario=> usuario.nombre);
        this.TipoUsuarios = response.map(usuario => usuario.rol);
        this.idUsuarios = response.map(usuarios=>usuarios.id);
      }
    )
  }
  
  //Metodo para enviar los datos a servidor al ser revisados.
  EnviarDatos(){
    let indice = 0;
    if(this.formulario.valid){
      if(this.CorreoUsuarios.includes(this.formulario.get("correo")?.value)){
        indice = this.CorreoUsuarios.indexOf(this.formulario.get("correo")?.value);
        if(this.formulario.get("password")?.value == this.ContUsuarios[indice]){
       
          this.usuarioIng.nombre = this.NomUsuarios[indice];
          this.usuarioIng.rol = this.TipoUsuarios[indice];
          this.usuarioIng.id = this.idUsuarios[indice]; 

          this.ingreso.guardarUsuario(this.usuarioIng).subscribe(response => {
          });
          alert("Ingreso correcto");

        }else{
          alert("Fallo en la contraseña");
        }
      }else{
        alert("Fallo en el correo");
      }
    }
  }

  //Metodo para mostrar el error que haya ocurrido en el formulario y que el cliente pueda cambiarlo.
  hasError(controlName:string, errorName:string){
    if(errorName == "minlenght"){
      console.log(this.formulario.get(controlName)?.hasError(errorName));
    }
    return this.formulario.get(controlName)?.hasError(errorName) && this.formulario.get(controlName)?.touched;
  }

}
