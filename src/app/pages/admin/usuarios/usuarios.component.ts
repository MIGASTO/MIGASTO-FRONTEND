import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { MatIcon } from '@angular/material/icon';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { Footer } from '../../../components/footer/footer';
import { AlertService } from '../../../services/alert.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    MatTooltipModule,
    AdminNavbarComponent,
    MatIcon,
    Footer
  ],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  private service = inject(UsuariosService);
  private alertService = inject(AlertService);
  displayedColumns: string[] = ['perfil', 'contacto', 'rol', 'acciones'];
  
  usuarios: any[] = [];
  loading = true;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.service.getUsuarios().subscribe({
      next: (data: any) => { 

        if (Array.isArray(data)) {
            this.usuarios = data;
        } else if (data && data.data && Array.isArray(data.data)) {
            this.usuarios = data.data;
        } else {
            this.usuarios = [];
        }
        
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
      }
    });
  }

cambiarRol(usuario: any) {
  if (!usuario || !usuario.rol) return;

  const nuevoRolId = usuario.rol.id === 1 ? 2 : 1;
  const nombreRol = nuevoRolId === 1 ? 'ADMIN' : 'USUARIO';
  const nombreUsuario = usuario.perfil?.nombre_completo || usuario.email;
  this.alertService.confirmar({
    titulo: 'Confirmar cambio de Rol',
    mensaje: `¿Estás seguro de cambiar el rol de ${nombreUsuario} a ${nombreRol}?`,
    tipo: 'update'
  }).subscribe(confirmado => {
    
    if (confirmado) {
      this.service.updateUsuario(usuario.id_usuario, { rolId: nuevoRolId }).subscribe({
        next: () => {
          this.alertService.actualizado(`El rol de ${nombreUsuario} ha sido cambiado a ${nombreRol}.`);
          this.cargarUsuarios();
        },
        error: (err) => {
          this.alertService.exito('⚠️ Error: No se pudo cambiar el rol. Intente de nuevo.',); 
        }
      });
    }
  });
}



  eliminar(id: number) {
    this.alertService.confirmar({
        titulo: '¿Eliminar Usuario?',
        mensaje: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
        tipo: 'delete'
    }).subscribe(confirmado => {
        if (confirmado) {
            this.service.deleteUsuario(id).subscribe(() => {
                this.alertService.eliminado('El usuario fue eliminado permanentemente.');
                this.cargarUsuarios();
            });
        } else {
          this.alertService.exito('⚠️ Error: No se pudo eliminar el usuario. Intente de nuevo.',); 
        }
    }); 
  }
}