import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarComponent } from '../editar/editar.component';
import { DatosIngresoService } from '../us-ing.service';

@Component({
  selector: 'app-dom',
  templateUrl: './dom.component.html',
  styleUrl: './dom.component.css'
})
export class DomComponent {

  //Declaracion del los servicios y las clases
  constructor(private api:ApiService, private dialog:MatDialog, private user: DatosIngresoService){}

  //Se declaran los diferentes arrays a utilizar
  fotos: any[] = [];
  usuarios: any[] = [];
  autores:any[] = [];
  resena: any[] = [];
  imgExternas: any[]=[];
  grupos: any[]=[];
  intGrupos:any[] = [];
  imgGrupos:any[] = [];
  comentGrupos:any[] = [];
  usuario:any;

  //Se cargan todos los datos a los arrays para mostrarlos en pantalla
  ngOnInit(): void {
      this.cargarFotos();
      this.cargarResena();
      this.cargarAutores();
      this.cargarUsuarios();
      this.cargarImgExt();
      this.cargarGrupos();
      this.cargarIntGrupos();
      this.cargarImgGrupos();
      this.cargarComentGrupos();
  }

  //Metodo para cargar los datos de las imagenes
  cargarFotos(){
    //Borramos la tabla para actualizarla
    this.fotos = [];
    this.api.getFotos().subscribe(
    data => {this.fotos = data},
    error =>{console.log("Error al cargar los libros", error)}
    );
  }

  //Metodo para cargar los datos de los usuarios
  cargarUsuarios(){
    this.usuarios = [];
    this.api.getUsuarios().subscribe(
    data => {this.usuarios = data},
    error =>{console.log("Error al cargar los usuarios", error)}
    );
  }

  //Metodo para cargar los datos de las reseñas
  cargarResena(){
    this.resena = [];
    this.api.getResena().subscribe(
    data => {this.resena = data},
    error =>{console.log("Error al cargar las reseñas", error)}
    );
  }

  //Metodo para cargar los datos de los autores
  cargarAutores(){
    this.autores = [];
    this.api.getAutores().subscribe(
    data => {this.autores = data},
    error =>{console.log("Error al cargar los autores", error)}
    );
  }

  //Metodo para cargar los datos de las imagenes externa
  cargarImgExt(){
    this.imgExternas = [];
    this.api.getImgExter().subscribe(
    data => {this.imgExternas = data},
    error =>{console.log("Error al cargar las imagenes externas", error)}
    );
  }

  //Metodo para cargar los datos de los grupos
  cargarGrupos(){
    this.grupos = [];
    this.api.getGrupos().subscribe(
    data => {this.grupos = data},
    error =>{console.log("Error al cargar los grupos", error)}
    );
  }

  //Metodo para cargar los integrantes de los grupos
  cargarIntGrupos(){
    this.intGrupos = [];
    this.api.getIntGrupos().subscribe(
    data => {this.intGrupos = data},
    error =>{console.log("Error al cargar los integrantes de los grupos", error)}
    );
  }

  ////Metodo para cargar los datos de las imagenes en los grupos
  cargarImgGrupos(){
    this.imgGrupos = [];
    this.api.getImgGrupos().subscribe(
    data => {this.imgGrupos = data},
    error =>{console.log("Error al cargar las imagenes de los grupos", error)}
    );
  }

  ////Metodo para cargar los datos de los comentarios en los grupos
  cargarComentGrupos(){
    this.comentGrupos = [];
    this.api.getComentGrupo().subscribe(
    data => {this.comentGrupos = data},
    error =>{console.log("Error al cargar los comentarios grupos", error)}
    );
  }

  //Metodo para abrir el modal para editar los datos pasando los id´s y el tipo de imagen
  editar(tipoDato: string, id:number | null = null, id2?:number){
    const abrir = this.dialog.open(EditarComponent, {
      width: '500px',
      data: { tipoDato, id, id2}
    });

    //Cargamos e nuevo los datos al cerrarse el modal
    abrir.afterClosed().subscribe(result =>{
      this.cargarFotos();
      this.cargarResena();
      this.cargarAutores();
      this.cargarUsuarios();
      this.cargarImgExt();
      this.cargarGrupos();
      this.cargarImgGrupos();
      this.cargarComentGrupos();
    });
  
  }

  //Metodo para borrar uno de los datos de las tablas segun el tipo de la tabla y las claves primarias 
  borrar(tipo:string, id:number, id2?:number){
    switch(tipo){
      case "usuarios":
          this.api.deleteUsuario(id).subscribe(
            response => {
              console.log("Se borro el usuario correctamente", response);
            },
            error => {
              console.log("Error al borrar el usuario", error);
            }
          );
          this.cargarUsuarios();
      break;

      case "fotos":
        this.api.deleteFotos(id).subscribe(
          response => {
            console.log("Se borro la foto correctamente", response);
          },
          error => {
            console.log("Error al borrar la foto", error);
          }
        );
        this.cargarFotos();
      break;

      case "resenas":
        this.api.deleteResena(id).subscribe(
          response => {
            console.log("Se borro la reseña correctamente", response);
          },
          error => {
            console.log("Error al borrar la reseña", error);
          }
        );
        this.cargarResena();
      break;

      case "autores":
        this.api.deleteAutores(id).subscribe(
          response => {
            console.log("Se borro el autor correctamente", response);
          },
          error => {
            console.log("Error al borrar el autor", error);
          }
        );
        this.cargarAutores();
      break;

      case "imgExt":
        this.api.deleteImgExter(id).subscribe(
          response => {
            console.log("Se borro la imagen correctamente", response);
          },
          error => {
            console.log("Error al borrar la imagen", error);
          }
        );
        this.cargarImgExt();
      break;

      case "grupos":
        this.api.deleteGrupos(id).subscribe(
          response => {
            console.log("Se borro el grupo correctamente", response);
          },
          error => {
            console.log("Error al borrar el grupo", error);
          }
        );
        this.cargarGrupos();
      break;

      case "intGrupos":
        this.user.usuario$.subscribe(usuario => {
          this.usuario = usuario;
        }); 

        console.log(this.usuario.id, id);
        this.api.deleteIntGrupos(id, this.usuario.id).subscribe(
          response => {
            console.log("Se borro el integramte del grupo correctamente", response);
          },
          error => {
            console.log("Error al borrar el integrante del grupo", error);
          }
        );
        this.cargarIntGrupos();
      break;

      case "imgGrupos":

        if(id2){
          this.api.deleteImgGrupos(id, id2).subscribe(
            response => {
              console.log("Se borro la imagen del grupo correctamente", response);
            },
            error => {
              console.log("Error al borrar la imagen del grupo", error);
            }
          );
          this.cargarImgGrupos();
        }
        
      break;

      case "comentGrupos":
        this.api.deleteComentGrupo(id).subscribe(
          response => {
            console.log("Se borro el comentario del grupo correctamente", response);
          },
          error => {
            console.log("Error al borrar el comentario del grupo", error);
          }
        );
        this.cargarComentGrupos();
      break;
    }
  }
}
