import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { PerfilService } from '../../../services/profile.service';
import { Footer } from '../../footer/footer';

@Component({
  imports: [Navbar, ReactiveFormsModule, RouterModule, Footer],
  selector: 'app-profile-form',
  templateUrl: './profile-form.html',
})
export class ProfileForm implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private router: Router
  ) {}

  ngOnInit() {
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
        alert('Perfil actualizado correctamente');
        this.router.navigate(['/profile']);
      },
      error: (err) => console.error('Error al actualizar perfil:', err),
    });
  }
}
