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

  obtenerResumen(): Observable<BalanceSummary> {
    return this.http.get<BalanceSummary>(`${this.apiUrl}/balance`);
  }

  obtenerEstadisticasGastos(): Observable<EstadisticasGastos> {
    return this.http.get<EstadisticasGastos>(`${this.apiUrl}/estadisticas/gastos`);
  }

  obtenerEstadisticasIngresos(): Observable<EstadisticasIngresos> {
    return this.http.get<EstadisticasIngresos>(`${this.apiUrl}/estadisticas/ingresos`);
  }
}
