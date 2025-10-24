import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Gasto {
    id?: number;
    descripcion: string;
    monto: number;
    categoria: string;
    fecha: string;
    }

    @Injectable({
    providedIn: 'root',
    })
    export class GastoService {
    private apiUrl = 'http://localhost:3000/api/gastos'; // 🔹 tu endpoint del backend

    constructor(private http: HttpClient) {}

    obtenerGastos(): Observable<Gasto[]> {
        return this.http.get<Gasto[]>(this.apiUrl);
    }

    agregarGasto(gasto: Gasto): Observable<Gasto> {
        return this.http.post<Gasto>(this.apiUrl, gasto);
    }

    actualizarGasto(id: number, gasto: Gasto): Observable<Gasto> {
        return this.http.put<Gasto>(`${this.apiUrl}/${id}`, gasto);
    }

    eliminarGasto(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

