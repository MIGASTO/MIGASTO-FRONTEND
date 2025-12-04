import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginError: string | null = null; 

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onLogin() {
    this.loginError = null; 

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value as { email: string; password: string }).subscribe({
      next: res => {

        try {
          const tokenRecibido = res.access_token;
          const decodedToken: any = jwtDecode(tokenRecibido);
          
          console.log('--- DECODIFICACIÓN INMEDIATA ---');
          console.log('Token decodificado en Login:', decodedToken);
          console.log('¿Tiene "exp"?_ ', decodedToken.hasOwnProperty('exp'));
          console.log('--- FIN DE DEPURACIÓN ---');

        } catch (e) {
          console.error('Error decodificando el token en el login', e);
        }

        console.log('✅ Login correcto. Redirigiendo a /home...');
        this.router.navigate(['/home']);
      },
      error: err => {
        const message = err?.error?.message || 'Error de conexión o credenciales inválidas.';
        console.error('⚠️ Error al iniciar sesión:', message, err);
        this.loginError = message; 
      },
    });
  }
}