import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerosService } from '../../../services/generos.service';
import { Navbar } from '../../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GeneroModal } from '../../../components/genero-modal/genero-modal';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-generos',
  standalone: true,
  imports: [
    CommonModule, Navbar, RouterModule, 
    MatTableModule, MatIconModule, MatButtonModule, MatDialogModule,MatProgressSpinnerModule
  ],
  templateUrl: './generos.component.html', // Usamos el HTML de abajo
})
export class GenerosComponent implements OnInit {
  private service = inject(GenerosService);
  private dialog = inject(MatDialog); // Inyectamos MatDialog

  generos: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  loading = false;

  ngOnInit() {
    this.cargarGeneros();
  }

  cargarGeneros() {
    this.loading = true;
    this.service.getGeneros().subscribe({
      next: (data) => {
        this.generos = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // ABRIR DIÁLOGO (Crear o Editar)
  abrirModal(genero?: any) {
    const dialogRef = this.dialog.open(GeneroModal, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'custom-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      data: genero // Si pasamos genero es EDITAR, si es undefined es CREAR
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (genero) {
          // Lógica de Actualizar
          this.service.updateGenero(genero.id_genero, result).subscribe(() => this.cargarGeneros());
        } else {
          // Lógica de Crear
          this.service.createGenero(result).subscribe(() => this.cargarGeneros());
        }
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este género?')) {
      this.service.deleteGenero(id).subscribe(() => this.cargarGeneros());
    }
  }
}