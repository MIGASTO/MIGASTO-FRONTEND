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

  // 1. Cambia la base URL para que no incluya '/balance' al final
  private apiUrl = 'http://localhost:8080/api/movimientos'; 

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<BalanceSummary> {
    // Aquí sí usamos /balance explícitamente
    return this.http.get<BalanceSummary>(`${this.apiUrl}/balance`);
  }

  // 2. Apunta a la ruta 'estadisticas/gastos' que tienes en tu Controller
  obtenerEstadisticasGastos(): Observable<EstadisticasGastos> {
    return this.http.get<EstadisticasGastos>(`${this.apiUrl}/estadisticas/gastos`);
  }

  // 3. Apunta a la ruta 'estadisticas/ingresos' que tienes en tu Controller
  obtenerEstadisticasIngresos(): Observable<EstadisticasIngresos> {
    return this.http.get<EstadisticasIngresos>(`${this.apiUrl}/estadisticas/ingresos`);
  }
}
