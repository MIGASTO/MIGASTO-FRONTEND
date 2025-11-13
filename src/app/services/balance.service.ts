import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface que refleja la estructura de la respuesta de tu API de NestJS
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
  // TODO: Confirma que esta URL sea la correcta para tu NestJS.
  private apiUrl = 'http://localhost:8080/api/movimientos/balance'; 

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<BalanceSummary> {
    return this.http.get<BalanceSummary>(this.apiUrl);
  }
}