import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

interface DecodedToken {
  sub: number;
  email: string;
  rol: string;
  iat: number;
  exp: number; // Ahora SÍ esperamos que exista
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) {}

  register(data: { email: string; password: string; rolId: number }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('🔐 Respuesta del backend al login:', response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // **** CAMBIO REVERTIDO ****
  // Volvemos a la lógica de verificación de expiración
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      
      // Verificamos que 'exp' exista (por si acaso) Y que no esté expirado
      if (!decoded.exp) return false; 
      
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false; // Token malformado
    }
  }
  // **** FIN DEL CAMBIO ****

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.rol || null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}