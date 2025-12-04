import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { Navbar } from '../../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  private service = inject(UsuariosService);
  displayedColumns: string[] = ['perfil', 'contacto', 'rol', 'acciones'];
  
  usuarios: any[] = [];
  loading = true;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.service.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  cambiarRol(usuario: any) {
    // Lógica simple: Si es 1 pasa a 2, si es 2 pasa a 1.
    const nuevoRolId = usuario.rol.id === 1 ? 2 : 1;
    const nombreRol = nuevoRolId === 1 ? 'ADMIN' : 'USUARIO';

    if (confirm(`¿Estás seguro de cambiar el rol de ${usuario.perfil.nombre_completo} a ${nombreRol}?`)) {
      this.service.updateUsuario(usuario.id_usuario, { rolId: nuevoRolId }).subscribe(() => {
        this.cargarUsuarios(); // Recargar para ver cambios
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar usuario permanentemente? Esta acción no se puede deshacer.')) {
      this.service.deleteUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}