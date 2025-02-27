import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { error } from 'console';
import { DatosIngresoService } from '../us-ing.service';
import { DescargarService } from '../descarga.service';


@Component({
  selector: 'app-mi-biblioteca',
  templateUrl: './mi-biblioteca.component.html',
  styleUrl: './mi-biblioteca.component.css'
})
export class MiBibliotecaComponent {

   
  constructor(private mover: Router, private api:ApiService, private router: ActivatedRoute, private ing: DatosIngresoService, private desc:DescargarService){}

  tamimg: {[key:number]:number} = {};
  fotosExternas:any[] = [];  
  fotoSolas: any[] = [];
  fotosExtSolas: any[] = [];
  unaExt:boolean = false;
  fotos:any[] = [];
  fotosSub:any[] = [];
  resenas:number[]=[];
  idUs:number=0;
  idAutor:number[] = [];
  usuario:any={
    nombre:"",
    id:0
  };
  muestra1:boolean=false;
  muestra2:boolean=false;


  ngOnInit(): void {

    this.ing.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    }); 

    this.router.paramMap.subscribe(params => {
      const dato = params.get('id');
      if(dato){
        this.idUs = +dato;
      }
     });

     setTimeout(()=>{
     this.api.getResena().subscribe(
      (data)=>{
            // Filtra los datos que coinciden con `id_autor == this.idUs`
            const datos = data.filter((i: { id_autor: number; }) => i.id_autor == this.idUs);
            // Extrae `id_img` de los datos filtrados
            this.resenas = datos.map((d: { id_img: any; }) => d.id_img);

            this.api.getFotos().subscribe(
              (data)=>{
                this.fotos = data.filter((data:{id:number})=> this.resenas.includes(data.id));
                this.fotosSub = data.filter((data:{id_autor:number})=> data.id_autor == this.usuario.id);
                this.muestra1 = true;
              }
            );

            this.api.getImgExter().subscribe(
              (data)=>{
                console.log(data);
                this.fotosExternas = data.filter((data:{idImg:number})=> this.resenas.includes(data.idImg));
                this.muestra2 = true;
              },
              (error)=>{
                console.log(error);
                this.muestra2 = true;
              }
             );
      },
      (error)=>{
        console.log("error al obt las resenas");
      }
     );
    },300)
  }

  //Metodo para rediriguir al componente subir
  agregar(){
    this.mover.navigate(["/subir"]);
  }

  //Metodo para agrandar la imagen segun el mouse este dentro de la imagen
  grande(id:number){
    this.tamimg[id] = 300;
  }

  //Metodo para volver al tamaño original la imagen
  pequeno(id:number){
    this.tamimg[id] = 180;
  }

  //Metodo para descargas las imagenes con las que ha reaccionado en archivos zip
  //Se separan las imagenes que se encuentran en la base de datos y en la api, debido a que son procesos diferentes.
  descargarLocales() {
    const datos = { imagenes: this.fotos };  
    
    //Epecificamos el tipo de respuesta que se obtendra del servidor 
    this.desc.descargaLocal(datos).subscribe(
      (response: Blob) => {
        //Guardamos la carpeta zip obtenida del servidor en una url ligada al file
        const url = window.URL.createObjectURL(response);
        //Creamos un elemento a para interactuar con la url especificando las caracteristica de la descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'descargaLocal.zip';
        //Accionamos el elemento haciendo el evento click sobre este
        a.click();
        // Borramos la url creada
        window.URL.revokeObjectURL(url); 
      },
      (error) => {
        console.error('Error:', error);
      });

    //Se revisa si ha interactuado con fotos provenientes de la API y se realiza el proceso de descarga.
    if(this.fotosExternas.length != 0){
      const data = {imagenes: this.fotosExternas}
      this.desc.descargaExt(data).subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'descargaExterna.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error:', error);
      });
    }
}

  //Proceso de descarga para las imagenes subidas por el usuario
  descargarSubidas(){
    const datos = { imagenes: this.fotosSub };  
    this.desc.descargaSubido(datos).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'descargaSubidas.zip'; // Nombre del archivo que se descargará
        a.click();
        window.URL.revokeObjectURL(url); // Liberar memoria
      },
      (error) => {
        console.error('Error:', error);
      });
  }

}
