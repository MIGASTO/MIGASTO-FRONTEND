import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  private readonly USER_KEY = 'usuario'; 

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { email: string; password: string; rolId: number }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('🔐 Respuesta del backend al login:', response);
        
        if (response.access_token) {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        
          let userToSave = response.user; 
          
          if (!userToSave) {
              const decoded = this.getDecodedToken();
              userToSave = { 
                  email: decoded?.email, 
                  rol: { nombre: decoded?.rol }
              };
          }

          localStorage.setItem(this.USER_KEY, JSON.stringify(userToSave));
          this.loggedIn.next(true);
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
      
      const isValid = Date.now() < decoded.exp * 1000;
      return isValid;
    } catch {
      return false; 
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

    const userString = localStorage.getItem(this.USER_KEY);
    if (userString) {
        const user = JSON.parse(userString);
        return user.rol?.nombre || user.rol || null;
    }

    const decoded = this.getDecodedToken();
    return decoded?.rol || null;
  }

  isAdmin(): boolean {
      const role = this.getUserRole();
      return role === 'admin' || role === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/request-password-reset`, { email });
  }

  restablecerContrasena(otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { otp, newPassword });
  }
}