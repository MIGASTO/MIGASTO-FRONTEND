import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/perfiles'; // ruta base de tu backend

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        });
    }

    obtenerPerfil(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    crearPerfil(datos: any): Observable<any> {
        return this.http.post(this.apiUrl, datos, { headers: this.getHeaders() });
    }

    actualizarPerfil(id: number, datos: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, datos, { headers: this.getHeaders() });
    }

    eliminarPerfil(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
