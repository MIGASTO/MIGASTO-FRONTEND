// src/app/services/ingresos.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
    })
    export class IngresosService {
    private apiUrl = 'http://localhost:8080/movimientos'; 

    constructor(private http: HttpClient) {}

    // Crear nuevo ingreso
    crearIngreso(ingreso: any): Observable<any> {
        return this.http.post(this.apiUrl, ingreso);
    }

    // Obtener lista de ingresos
    obtenerIngresos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Actualizar ingreso
    actualizarIngreso(id: number, ingreso: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, ingreso);
    }

    // Eliminar ingreso
    eliminarIngreso(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
