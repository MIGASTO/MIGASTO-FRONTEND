import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from "../../../components/admin-navbar/admin-navbar";
import { Footer } from '../../../components/footer/footer';
import { GeneroModal } from '../../../components/formularios/genero-modal/genero-modal';
import { GenerosService } from '../../../services/generos.service';

@Component({
  selector: 'app-generos',
  standalone: true,
  imports: [
    CommonModule, RouterModule, AdminNavbarComponent, Footer,
    MatTableModule, MatIconModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule,
    AdminNavbarComponent
],
  templateUrl: './generos.component.html',
})
export class GenerosComponent implements OnInit {
  private service = inject(GenerosService);
  private dialog = inject(MatDialog);

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

  abrirModal(genero?: any) {
    const dialogRef = this.dialog.open(GeneroModal, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'custom-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      data: genero 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (genero) {
          this.service.updateGenero(genero.id_genero, result).subscribe(() => this.cargarGeneros());
        } else {
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