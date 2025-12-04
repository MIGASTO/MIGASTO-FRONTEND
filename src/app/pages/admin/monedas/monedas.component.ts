import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonedasService } from '../../../services/monedas.service';
import { Navbar } from '../../../components/navbar/navbar';
import { RouterModule } from '@angular/router';

// Imports de Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Importamos el Modal
import { MonedaModal} from '../../../components/moneda-modal/moneda-modal';

@Component({
  selector: 'app-monedas',
  standalone: true,
  imports: [
    CommonModule, Navbar, RouterModule,
    MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule
  ],
  templateUrl: './monedas.component.html',
})
export class MonedasComponent implements OnInit {
  private service = inject(MonedasService);
  private dialog = inject(MatDialog);

  monedas: any[] = [];
  displayedColumns: string[] = ['codigo', 'tasa', 'acciones'];
  loading = false;

  ngOnInit() {
    this.cargarMonedas();
  }

  cargarMonedas() {
    this.loading = true;
    this.service.getMonedas().subscribe({
      next: (data) => {
        this.monedas = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  abrirModal(moneda?: any) {
    const dialogRef = this.dialog.open(MonedaModal  , {
      width: '100%',
      maxWidth: '500px', // Un poco más ancho que Géneros porque hay 2 columnas
      panelClass: 'custom-dialog-container',
      data: moneda
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (moneda) {
          // Editar
          this.service.updateMoneda(moneda.id_moneda, result).subscribe(() => this.cargarMonedas());
        } else {
          // Crear
          this.service.createMoneda(result).subscribe(() => this.cargarMonedas());
        }
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta moneda?')) {
      this.service.deleteMoneda(id).subscribe(() => this.cargarMonedas());
    }
  }
}