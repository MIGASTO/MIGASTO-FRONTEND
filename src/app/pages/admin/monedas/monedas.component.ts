import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonedasService } from '../../../services/monedas.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { Footer } from '../../../components/footer/footer';
import { MonedaModal } from '../../../components/formularios/moneda-modal/moneda-modal';
import { AlertService } from '../../../services/alert.service';


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
  private alertService = inject(AlertService);

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
          this.service.updateMoneda(moneda.id_moneda, result).subscribe({
            next: () => {
              this.alertService.actualizado('La moneda ha sido actualizada correctamente.');
              this.cargarMonedas();
            },
            error: (err) => {
                console.error(err);
            }
          });
        } else {
          this.service.createMoneda(result).subscribe({
            next: () => {
              this.alertService.exito('Nueva moneda registrada en el sistema.');
              this.cargarMonedas();
            }
          });
        }
      }
    });
  }

eliminar(id: number) {
    this.alertService.confirmar({
        titulo: '¿Eliminar moneda?',
        mensaje: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
        tipo: 'delete'
    }).subscribe(confirmado => {
        if (confirmado) {
            this.service.deleteMoneda(id).subscribe(() => {
                this.alertService.eliminado('La moneda fue eliminada permanentemente.');
                this.cargarMonedas();
            });
        }
    });
  }
}