import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, RouterModule, Footer, MatSidenavModule, MatListModule, MatIconModule, MatDividerModule, MatCardModule],
  templateUrl: './admin-home.html',
})
export class AdminHomeComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api'; 

  loading = true;

  stats = [
    { 
      title: 'Usuarios Totales', 
      value: 0, 
      iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 
      color: 'bg-blue-500', 
      loading: true 
    },
    { 
      title: 'Géneros', 
      value: 0, 
      iconPath: 'M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z', 
      color: 'bg-purple-500', 
      loading: true 
    },
    { 
      title: 'Monedas', 
      value: 0, 
      iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
      color: 'bg-emerald-500', 
      loading: true 
    },
    { 
      title: 'Tags', 
      value: 0, 
      iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', 
      color: 'bg-amber-500', 
      loading: true 
    },
  ];

  recentUsers: any[] = [];

  ngOnInit() {
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    this.loading = true;

    forkJoin({
      usuarios: this.http.get<any[]>(`${this.apiUrl}/usuarios`),
      generos: this.http.get<any[]>(`${this.apiUrl}/genero`),
      monedas: this.http.get<any[]>(`${this.apiUrl}/monedas`),
      tags: this.http.get<any[]>(`${this.apiUrl}/tags`)
    }).subscribe({
      next: (res) => {

        this.stats[0].value = res.usuarios.length;
        this.stats[0].loading = false;

        this.stats[1].value = res.generos.length;
        this.stats[1].loading = false;

        this.stats[2].value = res.monedas.length;
        this.stats[2].loading = false;

        this.stats[3].value = res.tags.length;
        this.stats[3].loading = false;

        const usuariosOrdenados = res.usuarios.sort((a, b) => b.id_usuario - a.id_usuario);
        
        this.recentUsers = usuariosOrdenados.slice(0, 5).map(u => ({
            name: u.perfil?.nombre_completo || 'Sin Nombre',
            email: u.email,
            date: u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : 'Reciente', 
            status: u.rol?.id === 1 ? 'Admin' : 'Usuario',
            rolId: u.rol?.id
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos del admin dashboard:', err);
        this.loading = false;
      }
    });
  }
}