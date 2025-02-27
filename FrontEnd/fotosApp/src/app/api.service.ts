import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  //Servicio para interactuar con los procesos CRUD con la base de datos.
  
  private apiUrl = "BackEnd/api.php";

  constructor(private http: HttpClient) { }

  //Acciones de los usuarios
  getUsuarios(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/usuarios`);
  }

  //Se declara que tipo de objeto se va a pasar 
  subirUsuarios(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/usuarios`, datos, { headers });
  }

  EditUsuario(id: number, usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/usuarios`, { id, ...usuario }, { headers });
  }

  deleteUsuario(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { headers });
  }

  //Acciones de las imagenes
  getFotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fotos`);
  }

  subirFotos(fotos: any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/fotos/`, fotos, {headers});
  }

  EditarFoto(id: number, fotos:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/fotos/${id}`, fotos, {headers});
  }

  deleteFotos(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/fotos/${id}`, { headers });
  }

  //Acciones de las reseñas
  getResena(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/resena`);
  }

  subirResena(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/resena`, datos, { headers });;
  }

  EditResena(id: number, resena: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/resena`, { id, ...resena }, { headers });
  }

  deleteResena(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/resena/${id}`, { headers });
  }

  //Acciones de los autores
  getAutores(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/autores`);
  }

  subirAutores(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/autores`, datos, { headers });
  }

  EditAutores(id: number, autores: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/autores`, { id, ...autores }, { headers });
  }

  deleteAutores(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/autores/${id}`, { headers });
  }

  //Acciones de las categorias
  getCategorias(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/categorias`);
  }

  //Acciones de los Grupos
  getGrupos(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/grupos`);
  }

  subirGrupos(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/grupos`, datos, { headers });
  }

  EditGrupos(id: number, grupos: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/grupos`, { id, ...grupos }, { headers });
  }

  deleteGrupos(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/grupos/${id}`, { headers });
  }

  //Acciones de los Integrantes Grupos
  getIntGrupos(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/intGrupos`);
  }

  subirIntGrupos(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/intGrupos`, datos, { headers });
  }

  EditIntGrupos(id: number, intGrupos: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/intGrupos`, { id, ...intGrupos }, { headers });
  }

  deleteIntGrupos(id: number, idUs:number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/intGrupos/${id}/${idUs}`, { headers });
  }

  //Acciones de para guardar las imagenes en Grupos
  getImgGrupos(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/imgGrupos`);
  }

  subirImgGrupos(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/imgGrupos`, datos, { headers });
  }

  EditImgGrupos(id: number, imgGrupos: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/imgGrupos`, { id, ...imgGrupos }, { headers });
  }

  deleteImgGrupos(id: number, idUs:number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/imgGrupos/${id}/${idUs}`, { headers });
  }

   //Acciones de para guardar las imagenes externas
   getImgExter(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/imgExternas`);
  }

  subirImgExter(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/imgExternas`, datos, { headers });
  }

  EditImgExter(id: number, imgExt: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/imgExternas`, { id, ...imgExt }, { headers });
  }

  deleteImgExter(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/imgExternas/${id}`, { headers });
  }

  //Acciones de para guardar las comentarios en grupos
  getComentGrupo(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/comentGrupos`);
  }

  subirComentGrupo(datos:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/comentGrupos`, datos, { headers });
  }

  EditComentGrupo(id: number, ComentGrupo: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/comentGrupos`, { id, ...ComentGrupo }, { headers });
  }

  deleteComentGrupo(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.apiUrl}/comentGrupos/${id}`, { headers });
  }
}
