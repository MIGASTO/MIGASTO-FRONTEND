import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-gastos',
  imports: [RouterModule, Navbar, CommonModule],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css'
})
export class Gastos {
gastos = [
    { descripcion: 'Almuerzo', monto: 15000, fecha: new Date() },
    { descripcion: 'Transporte', monto: 8000, fecha: new Date() },
  ];

  agregarGasto() {
    console.log('Agregar nuevo gasto');
    // Aquí abrirías un modal o redirigirías al formulario de agregar gasto
  }

  editarGasto(gasto: any) {
    console.log('Editar gasto:', gasto);
    // Aquí abrirías el formulario con los datos del gasto seleccionado
  }

  eliminarGasto(gasto: any) {
    console.log('Eliminar gasto:', gasto);
    // Aquí podrías mostrar una confirmación antes de eliminarlo
  }
}
