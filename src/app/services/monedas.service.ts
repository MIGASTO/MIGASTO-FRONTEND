import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonedasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/monedas';

  getMonedas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createMoneda(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateMoneda(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteMoneda(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}