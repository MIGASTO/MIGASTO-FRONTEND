import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Prestamo {
  id_prestamo?: number;
  prestamista: string;
  monto_total: number | string;
  monto_pagado?: number | string;
  monto_restante?: number | string; // Para la vista /details
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
  private apiUrl = 'http://localhost:8080/api/prestamos'; // Ajusta si tu puerto es diferente

  constructor(private http: HttpClient) {}

  // 1. Obtener vista resumida para la lista (ideal para tablas o tarjetas)
  // Endpoint: GET /prestamos/details
  getPrestamosDetails(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/details`);
  }

  // 2. Obtener todos los préstamos (data cruda completa)
  // Endpoint: GET /prestamos
  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  // 3. Obtener un préstamo por ID (con historial de abonos detallado)
  // Endpoint: GET /prestamos/:id
  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  // 4. Crear nuevo préstamo
  // Endpoint: POST /prestamos
  crearPrestamo(data: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, data);
  }

  // 5. Eliminar préstamo
  // Endpoint: DELETE /prestamos/:id
  eliminarPrestamo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 6. Agregar Abono a un préstamo
  // Endpoint: POST /prestamos/:id/abono
  agregarAbono(idPrestamo: number, monto: number): Observable<any> {
    const url = `${this.apiUrl}/${idPrestamo}/abono`;
    return this.http.post(url, { monto });
  }
}