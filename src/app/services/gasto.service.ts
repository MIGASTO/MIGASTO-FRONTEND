import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

    @Injectable({
    providedIn: 'root',
    })
    export class GastosService {
    private apiUrl = 'http://localhost:8080/api/movimientos';

    constructor(private http: HttpClient) {}

    obtenerGasto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos`);
    }

    crearGasto(gasto: any): Observable<any> {
        console.log('📦 Datos enviados al backend:', gasto);
        return this.http.post<any>(this.apiUrl, gasto);
    }

    obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    actualizarGasto(id: number, gasto: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, gasto);
    }

    eliminarGasto(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

