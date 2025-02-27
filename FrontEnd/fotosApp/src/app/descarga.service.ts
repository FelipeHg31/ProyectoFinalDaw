import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DescargarService {
  //private apiUrl = 'http://localhost/ProyectoFotos/BackEnd/descargar.php';
  private apiUrl = 'BackEnd/descargar.php';

  constructor(private http: HttpClient) {}

  //Servicio para descargas las imagenes en archivos tipo ZIP o individual. 
  //Se manda un json y se recive un blob con el archivo
  descargaLocal(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/local`, data, {headers, responseType: 'blob'}); 
  }

  descargaSubido(data:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/subida`, data, {headers, responseType: 'blob'}); 
  }

  descargaUnica(data:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/unica`, data, {headers, responseType: 'blob'});
  }

  descargaExt(data:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/externa`, data, {headers, responseType: 'blob'});
  }
}
