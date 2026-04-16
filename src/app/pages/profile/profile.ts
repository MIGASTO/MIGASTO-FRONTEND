import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { GenerosService } from '../../services/generos.service';
import { PerfilService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Navbar, RouterLink, RouterModule, Footer],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  usuario: any = {};
  generos: any[] = [];

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private generosService: GenerosService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.generosService.getGeneros().subscribe({
      next: (generos) => {
        this.generos = generos;
        this.cargarPerfil();
      },
      error: (err) => console.error("Error cargando géneros:", err),
    });
  }

  cargarPerfil() {
    this.perfilService.obtenerPerfil().subscribe({
      next: (res) => {

        const idGenero = res.id_genero ?? res.genero?.id_genero;

        const generoEncontrado = this.generos.find(
          g => g.id_genero === idGenero
        );

        this.usuario = {
          ...res,
          generoTexto: generoEncontrado ? generoEncontrado.nombre : "No especificado",
        };
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        if (err.status === 401) this.router.navigate(['/login']);
      },
    });
  }
}
