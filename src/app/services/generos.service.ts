import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/genero';

  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createGenero(data: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateGenero(id: number, data: { nombre: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteGenero(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}