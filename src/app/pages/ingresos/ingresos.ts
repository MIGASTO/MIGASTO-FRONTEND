// src/app/pages/ingresos/ingresos.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { IngresosService } from '../../services/ingreso.service';
import { IngresoForm } from './ingresos-form/ingresos-form';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, IngresoForm, Navbar],
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
    if (ingreso.id) {
      this.ingresosService.actualizarIngreso(ingreso.id, ingreso).subscribe(() => this.cargarIngresos());
    } else {
      this.ingresosService.crearIngreso(ingreso).subscribe(() => this.cargarIngresos());
    }
    this.cerrarFormulario();
  }

  editarIngreso(ingreso: any) {
    this.ingresoSeleccionado = { ...ingreso };
    this.mostrarFormulario = true;
  }

  eliminarIngreso(ingreso: any) {
    this.ingresosService.eliminarIngreso(ingreso.id).subscribe(() => this.cargarIngresos());
  }

  cerrarFormulario() {
    this.ingresoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
