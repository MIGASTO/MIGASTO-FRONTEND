import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: number;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) {}

  // Registro
  register(data: { email: string; password: string; rolId: number }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('🔐 Respuesta del backend al login:', response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          //console.log('✅ Token guardado en localStorage');
        } else {
          //console.warn('⚠️ No se recibió access_token en la respuesta');
        }
      })
    );
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Saber si está autenticado
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  // Obtener info del token decodificado
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  // Obtener rol actual del usuario
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.rol || null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
