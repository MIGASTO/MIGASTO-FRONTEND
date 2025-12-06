import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { IngresoForm } from '../../components/formularios/ingresos-form/ingresos-form';
import { Navbar } from '../../components/navbar/navbar';
import { IngresosService } from '../../services/ingreso.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, IngresoForm, Navbar, RouterModule, Footer, MatIconModule],
  templateUrl: './ingresos.html',
})
export class Ingresos {
  ingresos: any[] = [];
  mostrarFormulario = false;
  ingresoSeleccionado: any = null;

  constructor(private ingresosService: IngresosService) {}

  ngOnInit() {
    this.cargarIngresos();
  }

  cargarIngresos() {
    this.ingresosService.obtenerIngresos().subscribe({
      next: (data) => (this.ingresos = data),
      error: (err) => console.error('Error al cargar ingresos:', err),
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
      tags: Array.isArray(ingreso.tags)
        ? ingreso.tags
        : ingreso.tags
        ? [ingreso.tags]
        : [],
    };

    if (ingreso.id_movimiento) {
      this.ingresosService
        .actualizarIngreso(ingreso.id_movimiento, datosActualizados)
        .subscribe({
          next: () => this.cargarIngresos(),
          error: (err) => console.error('Error al actualizar ingreso:', err),
        });
    } else {
      this.ingresosService
        .crearIngreso(datosActualizados)
        .subscribe(() => this.cargarIngresos());
    }

    this.cerrarFormulario();
  }

  editarIngreso(ingreso: any) {
    this.ingresoSeleccionado = { ...ingreso };
    this.mostrarFormulario = true;
  }

  eliminarIngreso(ingreso: any) {
    if (confirm('¿Deseas eliminar este ingreso?')) {
      this.ingresosService
        .eliminarIngreso(ingreso.id_movimiento)
        .subscribe(() => this.cargarIngresos());
    }
  }

  cerrarFormulario() {
    this.ingresoSeleccionado = null;
    this.mostrarFormulario = false;
  }

  getTagNames(ingreso: any): string {
    if (!ingreso.tags || ingreso.tags.length === 0) return '—';
    return ingreso.tags.map((tag: any) => tag.nombre).join(', ');
  }
}
