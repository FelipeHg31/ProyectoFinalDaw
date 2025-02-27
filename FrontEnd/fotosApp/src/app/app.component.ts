import { Component } from '@angular/core';
import { DatosIngresoService } from './us-ing.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fotosApp';
  usuario:any ;

  constructor(private ing:DatosIngresoService){ }

  ngOnInit() {
    // Suscripción al usuario observable para recibir actualizaciones
    this.ing.usuario$.subscribe(usuario => {
      this.usuario = usuario || {nombre:'No', rol:'', id:0};
    });
  }

  //Metodo para cerrar la sesion, formateando los datos del objeto creado
  cerrarSesion(){
    this.ing.usuario$.subscribe(usuario => {
      this.usuario = usuario || {nombre:'No', rol:'', id:0};
    });
  }
}
