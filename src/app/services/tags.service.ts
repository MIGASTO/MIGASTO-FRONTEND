import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tags';

  getTags(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTagsGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos`);
  }

  getTagsIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ingresos`);
  }

  createTag(data: { nombre: string, id_categoria: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateTag(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}