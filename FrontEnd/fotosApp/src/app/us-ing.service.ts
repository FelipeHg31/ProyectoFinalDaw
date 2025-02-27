import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosIngresoService {

  //Servicio para crear el archivo temporal del usuario ingresado y su observable

  private apiUrl = 'BackEnd/usIngresado.php'; 

  //Establecemos un observable para poder obtener la información del usuario en cada momento.
  private usInfo = new BehaviorSubject<any>(null); 
  usuario$ = this.usInfo.asObservable();           

  constructor(private http: HttpClient) {
    // Creamos el archivo temporal
    this.obtenerUsuario().subscribe();
  }

  // Metodo para guardar el usuario
  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario).pipe(
      // Se actualiza el observable
      tap(() => this.usInfo.next(usuario))
    );
  }

  // Metodo para obtener el usuario
  obtenerUsuario(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(usuario => this.usInfo.next(usuario)) 
    );
  }
 
  //Metodo para borrar el usuario
  borrarUsuario(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      // Se borra el 
      tap(() => this.usInfo.next(null)) 
    );
  }
}
