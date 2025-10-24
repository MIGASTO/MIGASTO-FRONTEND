import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Gasto, GastoService } from '../../services/gasto.service';
import { GastoForm } from './gastos-form/gastos-form';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, GastoForm, Navbar],
  templateUrl: './gastos.html',
})
export class Gastos implements OnInit {
  gastos: Gasto[] = [];
  mostrarFormulario = false;
  gastoSeleccionado: Gasto | null = null;

  constructor(private gastoService: GastoService) {}

  ngOnInit() {
    this.cargarGastos();
  }

  cargarGastos() {
    this.gastoService.obtenerGastos().subscribe((data) => {
      this.gastos = data;
    });
  }

  guardarGasto(gasto: Gasto) {
    if (gasto.id) {
      this.gastoService.actualizarGasto(gasto.id, gasto).subscribe(() => this.cargarGastos());
    } else {
      this.gastoService.agregarGasto(gasto).subscribe(() => this.cargarGastos());
    }
    this.cerrarFormulario();
  }

  editarGasto(gasto: Gasto) {
    this.gastoSeleccionado = { ...gasto };
    this.mostrarFormulario = true;
  }

  eliminarGasto(gasto: Gasto) {
    if (confirm('¿Deseas eliminar este gasto?')) {
      this.gastoService.eliminarGasto(gasto.id!).subscribe(() => this.cargarGastos());
    }
  }

  cerrarFormulario() {
    this.gastoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
