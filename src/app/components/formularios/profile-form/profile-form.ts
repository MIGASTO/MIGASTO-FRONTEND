import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { PerfilService } from '../../../services/profile.service';
import { Footer } from '../../footer/footer';

import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { GenerosService } from '../../../services/generos.service';

@Component({
  imports: [Navbar, ReactiveFormsModule, RouterModule, Footer, CommonModule],
  selector: 'app-profile-form',
  templateUrl: './profile-form.html',
})
export class ProfileForm implements OnInit {
  form!: FormGroup;
  generos: any[] = [];
  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private alertService: AlertService,
    private router: Router,
    private genero: GenerosService,
  ) {}

  ngOnInit() {
    this.genero.getGeneros().subscribe({
      next: (data) => this.generos = data
    });
    this.form = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
      edad: [''],
      foto_perfil: [''],
      telefono: [''],
      id_genero: [''],
    });
    
    this.perfilService.obtenerPerfil().subscribe({
      next: (perfil) => this.form.patchValue(perfil),
      error: (err) => console.error('Error al cargar perfil:', err),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;


    this.perfilService.actualizarPerfil(this.form.value).subscribe({
      next: () => {
        this.alertService.actualizado('Perfil actualizado correctamente');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        console.log("ENVIANDO:", this.form.value);
        console.log("VALID:", this.form.valid);
        console.log("PAYLOAD:", this.form.value);
        console.error("Error al actualizar perfil:", err.error);
        this.alertService.confirmar({
            titulo: 'ERROR',
            mensaje: 'No se pudo actualizar el perfil.',
            tipo: 'update'
        });
      }
    });
  }
}