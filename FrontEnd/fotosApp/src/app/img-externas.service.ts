import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgExternasService {

  //Sevicio para hacer peticiones a la API externa

  private apiUrl = 'https://api.pexels.com/v1/search';
  private UrlID = 'https://api.pexels.com/v1';
  private apiKey = 'rI5DA5KPcIqyBVm1b1M3HXyd6LjBKmbQQweZDpGt2rThik8E7ou1g3vN'; // Reemplaza con tu clave de API de Pexels

  constructor(private http:HttpClient) { }

  //Pertición de varias imagenes
  getImages(query: string, perPage: number, page: number = 1) {
    const url = `${this.apiUrl}?query=${query}&per_page=${perPage}&page=${page}`;
    return this.http.get(url, {
      headers: {
        Authorization: this.apiKey
      }
    });
  }

  //Petición para una sola imagen por ID
  getImageById(id: number) {
    const url = `${this.UrlID}/photos/${id}`;
    console.log(url);
    return this.http.get(url, {
      headers: {
        Authorization: this.apiKey
      }
    });
  }
}
