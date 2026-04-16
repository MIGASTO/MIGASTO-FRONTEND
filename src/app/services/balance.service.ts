import { HttpClient, HttpParams } from '@angular/common/http'; // <--- IMPORTANTE: HttpParams
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BalanceSummary {
  totalGastos: number;
  totalIngresos: number;
  balance: number;
  resumen: string;
  filtros: { mes: string; anio: string };
}

export interface EstadisticasGastos {
  total: number;
  promedio: number;
  cantidad: number;
  max: number;
  graficoTags: Array<{ tag: string; total: number }>;
  graficoMensual: Array<{ mes: number; total: number }>;
  top5: Array<{ descripcion: string; monto: number }>;
}

export interface EstadisticasIngresos {
  total: number;
  promedio: number;
  cantidad: number;
  max: number;
  graficoTags: Array<{ tag: string; total: number }>;
  graficoMensual: Array<{ mes: number; total: number }>;
  top5: Array<{ descripcion: string; monto: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class BalanceService {

  private apiUrl = 'http://localhost:8080/api/movimientos'; 

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/balance`);
  }

  // CORRECCIÓN AQUÍ 👇
  obtenerEstadisticasGastos(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();

    // Si existen las fechas, las agregamos
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    // ¡IMPORTANTE! Pasamos { params } como segundo argumento
    return this.http.get<any>(`${this.apiUrl}/estadisticas/gastos`, { params });
  }

  // CORRECCIÓN AQUÍ 👇
  obtenerEstadisticasIngresos(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();

    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    // ¡IMPORTANTE! Pasamos { params } como segundo argumento
    return this.http.get<any>(`${this.apiUrl}/estadisticas/ingresos`, { params });
  }
}