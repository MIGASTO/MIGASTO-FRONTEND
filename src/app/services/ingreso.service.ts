import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresosService {
  private apiUrl = 'http://localhost:8080/api/movimientos';

  constructor(private http: HttpClient) {}

  crearIngreso(ingreso: any): Observable<any> {
    console.log('📦 Datos enviados al backend:', ingreso);
    return this.http.post(`${this.apiUrl}`, ingreso);
  }

  obtenerIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ingresos`);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarIngreso(id: number, ingreso: any): Observable<any> {
    console.log('📦 Datos enviados al backend path:', ingreso);
    return this.http.patch(`${this.apiUrl}/${id}`, ingreso);
  }

  eliminarIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

