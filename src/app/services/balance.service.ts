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
}