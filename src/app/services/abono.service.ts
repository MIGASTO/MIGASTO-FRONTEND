import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonoService {
  private apiUrl = 'http://localhost:8080/api/abonos'; 

  constructor(private http: HttpClient) {}

  // ... (tus otros métodos getAbonos, etc.)

  // 1. Crear Abono (Ya lo tenías)
  crearAbono(idPrestamo: number, monto: number): Observable<any> {
    // Recuerda que corregimos esto para apuntar a /prestamo/:id
    const url = `${this.apiUrl}/prestamo/${idPrestamo}`;
    return this.http.post(url, { monto });
  }

  // 2. NUEVO MÉTODO: Generar Gasto Automático
  // Endpoint: POST /api/abonos/:id/generar-gasto
  generarGasto(idAbono: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}/generar-gasto`;
    return this.http.post(url, {}); // Body vacío, el ID va en la URL
  }

  // 3. Actualizar Abono (Nuevo)
  // Endpoint: PATCH /api/abonos/:id
  actualizarAbono(idAbono: number, nuevoMonto: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}`;
    return this.http.patch(url, { monto: nuevoMonto });
  }

  // 4. Eliminar Abono (Nuevo)
  // Endpoint: DELETE /api/abonos/:id
  eliminarAbono(idAbono: number): Observable<any> {
    const url = `${this.apiUrl}/${idAbono}`;
    return this.http.delete(url);
  }
}