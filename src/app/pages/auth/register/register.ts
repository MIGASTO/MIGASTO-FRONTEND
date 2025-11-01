import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Rol fijo (puedes cambiarlo según tu lógica)
    const userData = {
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      rolId: 1,
    };

    this.auth.register(userData).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        alert(err?.error?.message || 'Error en el registro');
      },
    });
  }
}
