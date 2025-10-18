
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { GastoForm } from './gastos-form/gastos-form';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, GastoForm, Navbar],
  templateUrl: './gastos.html',
})
export class Gastos {
  gastos = [
    { id: 1, descripcion: 'Transporte', monto: 8000, fecha: '2025-10-17' },
    { id: 2, descripcion: 'Comida', monto: 15000, fecha: '2025-10-16' },
  ];

  mostrarFormulario = false;
  gastoSeleccionado: any = null;

  guardarGasto(gasto: any) {
    if (gasto.id) {
      const index = this.gastos.findIndex(g => g.id === gasto.id);
      this.gastos[index] = gasto;
    } else {
      gasto.id = this.gastos.length + 1;
      this.gastos.push(gasto);
    }
    this.cerrarFormulario();
  }

  editarGasto(gasto: any) {
    this.gastoSeleccionado = { ...gasto };
    this.mostrarFormulario = true;
  }

  eliminarGasto(gasto: any) {
    this.gastos = this.gastos.filter(g => g.id !== gasto.id);
  }

  cerrarFormulario() {
    this.gastoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
