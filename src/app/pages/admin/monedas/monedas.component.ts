import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonedasService } from '../../../services/monedas.service';

// Imports de Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

// Importamos el Modal
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { Footer } from '../../../components/footer/footer';
import { MonedaModal } from '../../../components/formularios/moneda-modal/moneda-modal';

@Component({
  selector: 'app-monedas',
  standalone: true,
  imports: [
    CommonModule, AdminNavbarComponent, RouterModule,
    MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule, Footer
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
      maxWidth: '500px',
      panelClass: 'custom-dialog-container',
      data: moneda
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (moneda) {
          this.service.updateMoneda(moneda.id_moneda, result).subscribe(() => this.cargarMonedas());
        } else {
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