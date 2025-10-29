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
    const fechaFormateada = ingreso.fecha
      ? new Date(ingreso.fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const datosActualizados = {
      descripcion: ingreso.descripcion,
      monto: ingreso.monto,
      fecha: fechaFormateada,
      id_categoria: ingreso.id_categoria,
      //remover comentarios si se usan estos campos 
      // cuando se integre moneda y tag dinamicos
      //id_moneda: ingreso.id_moneda,
      //tags[]: ingreso.tags[],
      id_moneda: 1,
      tags:[1],
    };

    if (ingreso.id_movimiento) {
      this.ingresosService
        .actualizarIngreso(ingreso.id_movimiento, datosActualizados)
        .subscribe({
          next: () => this.cargarIngresos(),
          error: (err) => console.error('Error al actualizar:', err),
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
    if (confirm('¿Deseas eliminar este gasto?')){
      this.ingresosService
      .eliminarIngreso(ingreso.id_movimiento)
      .subscribe(() => this.cargarIngresos());
    }
    }
    

  cerrarFormulario() {
    this.ingresoSeleccionado = null;
    this.mostrarFormulario = false;
  }
}
