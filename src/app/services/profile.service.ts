import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
    })
    export class PerfilService {
    private apiUrl = 'http://localhost:8080/api/perfiles';

    constructor(private http: HttpClient) {}

    obtenerPerfil(): Observable<any> {
        return this.http.get(`${this.apiUrl}/me`);
    }

    actualizarPerfil(datos: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/me`, datos);
    }
}