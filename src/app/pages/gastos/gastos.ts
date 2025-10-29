import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { GastosService } from '../../services/gasto.service';
import { GastoForm } from './gastos-form/gastos-form';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, GastoForm, Navbar],
  templateUrl: './gastos.html',
})
export class Gastos {
  gastos: any[] = [];
  mostrarFormulario = false;
  gastoSeleccionado: any = null;

  constructor(private gastosService: GastosService) {}

  ngOnInit() {
    this.cargarGastos();
  }

  cargarGastos() {
    this.gastosService.obtenerGasto().subscribe({
      next: (data) => (this.gastos = data),
      error: (err) => console.error('Error al cargar ingresos:', err),
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
      //remover comentarios si se usan estos campos 
      // cuando se integre moneda y tag dinamicos
      //id_moneda: gasto.id_moneda,
      //tags[]: gasto.tags[],
      id_moneda: 1,
      tags:[1],
    };

    if (gasto.id_movimiento) {
      this.gastosService
        .actualizarGasto(gasto.id_movimiento, datosActualizados)
        .subscribe({
          next: () => this.cargarGastos(),
          error: (err) => console.error('Error al actualizar:', err),
        });
    } else {
      
      this.gastosService
        .crearGasto(datosActualizados)
        .subscribe(() => this.cargarGastos());
    }

    this.cerrarFormulario();
  }

  editarGasto(gasto: any) {
    this.gastoSeleccionado = { ...gasto };
    this.mostrarFormulario = true;
  }

  eliminarGasto(gasto: any) {
    if (confirm('¿Deseas eliminar este gasto?')) {
      this.gastosService.eliminarGasto(gasto.id_movimiento)
      .subscribe(() => this.cargarGastos());
    }
  }

  cerrarFormulario() {
    this.gastoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
