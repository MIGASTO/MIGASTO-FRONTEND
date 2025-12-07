import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { GastoForm } from '../../components/formularios/gastos-form/gastos-form';
import { Navbar } from '../../components/navbar/navbar';
import { AlertService } from '../../services/alert.service';
import { GastosService } from '../../services/gasto.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, Footer, MatIconModule, MatDialogModule],
  templateUrl: './gastos.html',
})
export class Gastos implements OnInit {
  gastos: any[] = [];

  constructor(
    private gastosService: GastosService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarGastos();
  }

  cargarGastos() {
    this.gastosService.obtenerGasto().subscribe({
      next: (data) => (this.gastos = data),
      error: (err) => console.error('Error al cargar gastos:', err),
    });
  }

  // --- LÓGICA DEL MODAL ---
  abrirFormulario(gastoEditar?: any) {
    const dialogRef = this.dialog.open(GastoForm, {
      width: '95%',
      maxWidth: '500px',
      disableClose: true,
      data: gastoEditar ? { ...gastoEditar } : null
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.guardarGasto(resultado);
      }
    });
  }

  guardarGasto(gasto: any) {
    const fechaFormateada = gasto.fecha
      ? new Date(gasto.fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const datosActualizados = {
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      fecha: fechaFormateada,
      id_categoria: gasto.id_categoria,
      id_moneda: gasto.id_moneda ?? null,
      tags: Array.isArray(gasto.tags) ? gasto.tags : [],
    };

    if (gasto.id_movimiento) {
      this.gastosService.actualizarGasto(gasto.id_movimiento, datosActualizados)
        .subscribe({
          next: () => {
            this.cargarGastos();
            this.alertService.actualizado('Gasto actualizado correctamente');
          },
          error: (err) => {
            console.error(err);
            this.alertService.confirmar({titulo: 'Error', mensaje: 'No se pudo actualizar', tipo: 'update'});
          }
        });
    } else {
      this.gastosService.crearGasto(datosActualizados)
        .subscribe({
          next: () => {
            this.cargarGastos();
            this.alertService.exito('Gasto registrado exitosamente');
          },
          error: (err) => {
            console.error(err);
            this.alertService.confirmar({titulo: 'Error', mensaje: 'No se pudo crear', tipo: 'update'});
          }
        });
    }
  }

  eliminarGasto(gasto: any) {
    this.alertService.confirmar({
      titulo: '¿Eliminar Gasto?',
      mensaje: 'El gasto se eliminará permanentemente.',
      tipo: 'delete'
    }).subscribe((confirmado) => {
      if (confirmado) {
        this.gastosService.eliminarGasto(gasto.id_movimiento)
          .subscribe({
            next: () => {
              this.cargarGastos();
              this.alertService.eliminado('Gasto eliminado');
            },
            error: (err) => console.error(err)
          });
      }
    });
  }

  getTagNames(gasto: any): string {
    if (!gasto.tags || gasto.tags.length === 0) return '—';
    return gasto.tags.map((tag: any) => tag.nombre).join(', ');
  }
}