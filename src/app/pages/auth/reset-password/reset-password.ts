import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  paso = 1;
  cargando = false;
  
  emailForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formulario para el Paso 1
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulario para el Paso 2
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Acción del Paso 1: Enviar correo
  enviarCodigo() {
    if (this.emailForm.invalid) return;
    
    this.cargando = true;
    const email = this.emailForm.value.email;

    this.authService.solicitarRecuperacion(email).subscribe({
      next: () => {
        this.cargando = false;
        this.paso = 2; 
        alert('Código enviado. Revisa tu bandeja de entrada.');
      },
      error: (error) => {
        this.cargando = false;
        console.error(error);
        alert('Error: No pudimos enviar el código. Verifica el correo.');
      }
    });
  }

  cambiarPassword() {
    if (this.resetForm.invalid) return;

    this.cargando = true;
    const { otp, newPassword } = this.resetForm.value;

    this.authService.restablecerContrasena(otp, newPassword).subscribe({
      next: () => {
        this.cargando = false;
        alert('¡Éxito! Tu contraseña ha sido cambiada.');
        this.router.navigate(['/login']); // Redirigir al login
      },
      error: (error) => {
        this.cargando = false;
        console.error(error);
        alert('Error: Código inválido o expirado.');
      }
    });
  }

  reenviarCodigo() {
    this.enviarCodigo();
  }
}