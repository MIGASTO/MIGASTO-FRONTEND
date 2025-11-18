import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface BalanceSummary {
  totalGastos: number;
  totalIngresos: number;
  balance: number;
  resumen: string;
  filtros: { mes: string; anio: string };
}

@Injectable({
  providedIn: 'root',
})
export class BalanceService {

  private apiUrl = 'http://localhost:8080/api/movimientos/balance'; 

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<BalanceSummary> {
    return this.http.get<BalanceSummary>(this.apiUrl);
  }

  // Obtener estadísticas de gastos por categoría
  obtenerGastosPorCategoria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gastos-categoria`);
  }

  // Obtener estadísticas de ingresos por categoría
  obtenerIngresosPorCategoria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingresos-categoria`);
  }

  // Obtener evolución mensual (últimos 6 meses)
  obtenerEvolucionMensual(): Observable<any> {
    return this.http.get(`${this.apiUrl}/evolucion-mensual`);
  }

  // Obtener top gastos
  obtenerTopGastos(limite: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-gastos?limite=${limite}`);
  }

  // Obtener top ingresos
  obtenerTopIngresos(limite: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-ingresos?limite=${limite}`);
  }
}