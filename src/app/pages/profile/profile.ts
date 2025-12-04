import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { PerfilService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Navbar, RouterLink, RouterModule, Footer],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  usuario: any = {};

  constructor(private perfilService: PerfilService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.perfilService.obtenerPerfil().subscribe({
      next: (res) => {
        this.usuario = {
          ...res,
          generoTexto: this.obtenerGenero(res.genero?.id_genero),
        };
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        if (err.status === 401) this.router.navigate(['/login']);
      },
    });
  }

  obtenerGenero(id: number): string {
    switch (id) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Femenino';
      case 3:
        return 'Otro';
      case 4:
        return 'Prefiero no decirlo';
      default:
        return 'No especificado';
    }
  }
}
