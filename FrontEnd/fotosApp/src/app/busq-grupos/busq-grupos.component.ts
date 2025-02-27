import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosIngresoService } from '../us-ing.service';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { NuevoGrupoComponent } from '../nuevo-grupo/nuevo-grupo.component';

@Component({
  selector: 'app-busq-grupos',
  templateUrl: './busq-grupos.component.html',
  styleUrl: './busq-grupos.component.css'
})
export class BusqGruposComponent { 

  //Se declaran las variables y los objetos
  creadores:any[] = [];
  usIntegrado:any={
    id_grupo:0,
    id_us:0
  }
  creadores2:any[] = [];
  grupos:any[] = [];
  gruposUs:any[] = [];
  usuario:any={
    nombre:"",
    id:0
  }

  //Se declaran las clases y los servicios a utilizar
  constructor(private api:ApiService, private router: ActivatedRoute, private ing: DatosIngresoService, private dialog:MatDialog, private mover: Router){}
 
  //Se obtiene los usuarios y los grupos
  ngOnInit(): void {
    this.ing.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    }); 
    
   this.obtGrupos();
    
  }

  //Metodo para los grupos de forma separaa en los que el usuario esta y en los que no
  obtGrupos(){
    this.api.getGrupos().subscribe(
      (resp)=>{
        const datos = resp;

        if(this.usuario.id){
          
          this.api.getIntGrupos().subscribe(
            (respuesta)=>{
              const data = respuesta.filter((i: { id_us: number; }) => i.id_us == this.usuario.id);
              const soloID = data.map((id:{id_grupo:number})=>id.id_grupo);
              this.gruposUs = datos.filter((d:{id:number})=> soloID.includes(d.id));
              this.grupos = datos.filter((d:{id:number})=> !soloID.includes(d.id));
            },
            (error)=>{
              console.log("No se revisar los datos de los grupos personales");
            }
          );

    
        }
      },
      (error)=>{
        console.log("No ingreso ", error)
      }
    );
    console.log(this.gruposUs);
  }

  //Metodo para abrir el modal para agregar un nuevo grupo
  modal(id:number){
    const abrir = this.dialog.open(NuevoGrupoComponent,{
      width: '400px',
      data: {id}
    });

    abrir.afterClosed().subscribe(resp =>{
      this.obtGrupos();
    })
  }

  //Metodo para moverse al componente de grupo segun el seleccionado
  moverse(id:number){
    this.mover.navigate(["/grupos/"+id+""]);
  }

  //Metodo para ingresar a un grupo donde el usuario no este y se redirecciona a e componente del grupo
  ingresar(id:number){

    this.usIntegrado.id_grupo = id;
    this.usIntegrado.id_us = this.usuario.id;
    console.log("Esta el usuarios", this.usuario.id);
    this.api.subirIntGrupos(this.usIntegrado).subscribe(
      (resp)=>{
        console.log("Se integro al grupo");
      },
      (error)=>{
        console.log("No se integro en el grupo");
      }
    )
    this.mover.navigate(["/grupos/"+id+""]);
  }

  //Metodo para salirse de un grupo borrando el registro de la imagen
  salirse(id:number){
    this.api.deleteIntGrupos(id, this.usuario.id).subscribe(
      (resp)=>{
        console.log("Se borro del grupo")
        this.obtGrupos();
      },
      (error)=>{
        console.log("No se borro del grupo");
      }
    );
  }
}
