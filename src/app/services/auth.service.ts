import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

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

  // --- MÉTODOS EXISTENTES ---

  register(data: { email: string; password: string; rolId: number }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('🔐 Respuesta del backend al login:', response);
        if (response.access_token) {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      
      if (!decoded.exp) return false; 
      
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false; // Token malformado
    }
  }

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

  // --- NUEVOS MÉTODOS PARA RESET PASSWORD ---

  /**
   * Envía el correo al backend para solicitar el código OTP.
   */
  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/request-password-reset`, { email });
  }

  /**
   * Envía el código OTP recibido y la nueva contraseña para actualizarla.
   */
  restablecerContrasena(otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { otp, newPassword });
  }
}