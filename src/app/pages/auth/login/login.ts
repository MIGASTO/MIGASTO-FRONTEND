import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  loading: boolean = false;

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

    this.loading = true;

    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.auth.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;

        if (this.auth.isAdmin()) {
            console.log('👑 Rol Admin detectado. Redirigiendo al panel de control...');
            this.router.navigate(['/admin/dashboard']);
        } else {
            console.log('👤 Usuario estándar. Redirigiendo a home...');
            this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 401 || err.status === 403) {
            this.loginError = 'Correo o contraseña incorrectos.';
        } else if (err.status === 0) {
            this.loginError = 'No hay conexión con el servidor. Revisa tu internet o si el backend está encendido.';
        } else {
            this.loginError = err.error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
        }
      },
    });
  }
}