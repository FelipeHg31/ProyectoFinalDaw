import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

//Objeto que se enviara al servidor para crear un nuevo usuario
  usuarioNuevo:any = {
    nombre:"",
    correo:"",
    password:"",
    password2:"",
    rol:""
  }

  CorreoUsuarios: string[] = [];
  NomUsuarios: string[] = [];
  

  formulario: FormGroup;

  constructor(private form:FormBuilder, private api:ApiService){
    this.formulario = this.form.group({
      nombre: ["", [Validators.required, Validators.minLength(4)]],
      correo: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      password2: ["", [Validators.required, Validators.minLength(6)]],
      rol:[""]
    })
  }
  
  ngOnInit(): void {
    //Borramos cualquier dato que haya en el formulario
    this.formulario.reset();

    //Obtenemos los correos y los nombres de los usuarios que esten en la base de datos
    this.api.getUsuarios().subscribe(
      (response: any[])=>{
        this.CorreoUsuarios = response.map(usuario=> usuario.correo);
        this.NomUsuarios = response.map(usuario=> usuario.nombre);
      }
    )

  }

  // Metodo para guardar los valores del formulario
  guardarDatos() {
    this.usuarioNuevo = {
      nombre: this.formulario.get("nombre")?.value,
      correo: this.formulario.get("correo")?.value,
      password: this.formulario.get("password")?.value,
      password2: this.formulario.get("password2")?.value,
      //Al crearse un usuario este sera por defecto de tipo usuario
      rol: "usuario"
    };
  }
  
  //Metodo para verificar los datos del formulario y enviarlo al servidor. Usando el servicio ApiService
  EnviarDatos() {
    if (this.formulario.valid) {
      this.guardarDatos();
      
      //Verificamos que el correo y el nombre sean unicos
      if(!this.CorreoUsuarios.includes(this.usuarioNuevo.correo)){
        if(!this.NomUsuarios.includes(this.usuarioNuevo.nombre)){
          
          if(this.usuarioNuevo.password == this.usuarioNuevo.password2 ){
          console.log('Datos enviados:', this.usuarioNuevo);
           // Enviar los datos como JSON
          this.api.subirUsuarios(this.usuarioNuevo).subscribe(
            response => {
              console.log("Usuario registrado correctamente", response);
              alert("Usuario registrado correctamente");
            },
            error => {
              console.log("Error al registrar el usuario", error);
              alert("Error al ingresar el usuario");
            }
            );
          }else{
            alert('Las contraseñas no son iguales');
          }

        } else {
          alert('El nombre ya se encuentra en la base de datos, por favor cambialo');
        }
      }else{
          alert('El correo ya se encuentra en la base de datos, por favor cambialo');
          
      }
    }else{
      console.log("Formulario no válido");
    }
    
  }

  //Metodo para mostrar el error producido en el formulario
  hasError(controlName:string, errorName:string){
    return this.formulario.get(controlName)?.hasError(errorName) && this.formulario.get(controlName)?.touched;
  }

}
