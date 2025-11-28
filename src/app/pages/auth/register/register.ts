import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);


  generos = [
    { id: 1, nombre: 'Masculino' },
    { id: 2, nombre: 'Femenino' },
    { id: 3, nombre: 'Otro' },
    { id: 4, nombre: 'Prefiero no decirlo' }
  ];

  registerError: string | null = null;

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
    edad: ['', [Validators.required, Validators.min(18)]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    foto_perfil: [''],
    id_genero: ['', [Validators.required]]
  });

  ngOnInit() {

  }

  onSubmit() {
    this.registerError = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;


    const userData = {
      email: formValue.email!,
      password: formValue.password!,
      rolId: 2, 
      nombre_completo: formValue.nombre_completo!,
      edad: formValue.edad!.toString(), 
      telefono: formValue.telefono!,
      foto_perfil: formValue.foto_perfil || 'https://example.com/default-avatar.png', 
      id_genero: Number(formValue.id_genero) 
    };

    console.log('Enviando datos:', userData);

    this.auth.register(userData).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);

        this.router.navigate(['/login']);
      },
      error: err => {
        const message = err?.error?.message || 'Error en el registro. Intenta nuevamente.';
        console.error('Error registro:', err);
        this.registerError = message;
      },
    });
  }
}
