import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { IngresoForm } from '../../components/formularios/ingresos-form/ingresos-form';
import { Navbar } from '../../components/navbar/navbar';
import { AlertService } from '../../services/alert.service';
import { IngresosService } from '../../services/ingreso.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, Footer, MatIconModule, MatDialogModule], 
  templateUrl: './ingresos.html',
})
export class Ingresos {
  ingresos: any[] = [];
  
  constructor(
    private ingresosService: IngresosService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarIngresos();
  }

  cargarIngresos() {
    this.ingresosService.obtenerIngresos().subscribe({
      next: (data) => (this.ingresos = data),
      error: (err) => console.error('Error al cargar ingresos:', err),
    });
  }

  abrirFormulario(ingresoEditar?: any) {
    const dialogRef = this.dialog.open(IngresoForm, {
      width: '95%',
      maxWidth: '600px',
      disableClose: true,
      data: ingresoEditar ? { ...ingresoEditar } : null
    });

    // CUANDO SE CIERRA EL MODAL
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.guardarIngreso(resultado);
      }
    });
  }

  guardarIngreso(ingreso: any) {
    const fechaFormateada = ingreso.fecha
      ? new Date(ingreso.fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const datosActualizados = {
      descripcion: ingreso.descripcion,
      monto: ingreso.monto,
      fecha: fechaFormateada,
      id_categoria: ingreso.id_categoria,
      id_moneda: ingreso.id_moneda ?? null,
      tags: Array.isArray(ingreso.tags) ? ingreso.tags : [],
    };

    if (ingreso.id_movimiento) {
      this.ingresosService.actualizarIngreso(ingreso.id_movimiento, datosActualizados)
        .subscribe({
          next: () => {
            this.cargarIngresos();
            this.alertService.actualizado('Ingreso actualizado correctamente');
          },
          error: (err) => console.error(err),
        });
    } else {
      this.ingresosService.crearIngreso(datosActualizados)
        .subscribe({
          next: () => {
            this.cargarIngresos();
            this.alertService.exito('Ingreso registrado correctamente');
          },
          error: (err) => console.error(err)
        });
    }
  }

  eliminarIngreso(ingreso: any) {
    this.alertService.confirmar({
      titulo: '¿Eliminar Ingreso?',
      mensaje: 'Esta acción no se puede deshacer.',
      tipo: 'delete'
    }).subscribe((confirmado) => {
      if (confirmado) {
        this.ingresosService.eliminarIngreso(ingreso.id_movimiento)
          .subscribe({
            next: () => {
              this.cargarIngresos();
              this.alertService.eliminado('Ingreso eliminado correctamente');
            },
            error: (err) => console.error(err)
          });
      }
    });
  }

  getTagNames(ingreso: any): string {
    if (!ingreso.tags || ingreso.tags.length === 0) return '—';
    return ingreso.tags.map((tag: any) => tag.nombre).join(', ');
  }
}