import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { IngresoForm } from './ingresos-form/ingresos-form';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, IngresoForm, Navbar],
  templateUrl: './ingresos.html',
})
export class Ingresos {
  ingresos = [
    { id: 1, descripcion: 'Salario', monto: 2000000, fecha: '2025-10-01' },
    { id: 2, descripcion: 'Venta', monto: 500000, fecha: '2025-10-10' },
  ];

  mostrarFormulario = false;
  ingresoSeleccionado: any = null;

  guardarIngreso(ingreso: any) {
    if (ingreso.id) {
      const index = this.ingresos.findIndex(i => i.id === ingreso.id);
      this.ingresos[index] = ingreso;
    } else {
      ingreso.id = this.ingresos.length + 1;
      this.ingresos.push(ingreso);
    }
    this.cerrarFormulario();
  }

  editarIngreso(ingreso: any) {
    this.ingresoSeleccionado = { ...ingreso };
    this.mostrarFormulario = true;
  }

  eliminarIngreso(ingreso: any) {
    this.ingresos = this.ingresos.filter(i => i.id !== ingreso.id);
  }

  cerrarFormulario() {
    this.ingresoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
