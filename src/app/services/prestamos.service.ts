import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Prestamo {
  id_prestamo?: number;
  prestamista: string;
  monto_total: number | string;
  monto_pagado?: number | string;
  monto_restante?: number | string;
  fecha_limite: string;
  descripcion?: string;
  estado?: string;
  fecha_creacion?: string;
  abonos?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private apiUrl = 'http://localhost:8080/api/prestamos';

  constructor(private http: HttpClient) {}

  getPrestamosDetails(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/details`);
  }

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  crearPrestamo(data: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, data);
  }

  eliminarPrestamo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  agregarAbono(idPrestamo: number, monto: number): Observable<any> {
    const url = `${this.apiUrl}/${idPrestamo}/abono`;
    return this.http.post(url, { monto });
  }
}