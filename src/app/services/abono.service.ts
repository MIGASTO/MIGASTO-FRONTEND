import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonoService {
  private apiUrl = 'http://localhost:8080/api/abonos'; 

  constructor(private http: HttpClient) {}

  crearAbono(idPrestamo: number, monto: number): Observable<any> {
    const url = `${this.apiUrl}/prestamo/${idPrestamo}`;
    return this.http.post(url, { monto });
  }

  generarGasto(idAbono: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}/generar-gasto`;
    return this.http.post(url, {}); 
  }

  actualizarAbono(idAbono: number, nuevoMonto: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}`;
    return this.http.patch(url, { monto: nuevoMonto });
  }

  eliminarAbono(idAbono: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}`;
    return this.http.delete(url);
  }
}