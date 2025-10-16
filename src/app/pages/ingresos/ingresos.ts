import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-ingresos',
  imports: [RouterModule, Navbar, CommonModule],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css'
})
export class Ingresos {
ingresos = [
    { descripcion: 'Efectivo', monto: 200000, fecha: new Date() },
    { descripcion: 'Bancario', monto: 80000, fecha: new Date() },
  ];

  agregarIngreso() {
    console.log('Agregar nuevo ingreso');
    // Aquí abrirías un modal o redirigirías al formulario de agregar ingreso
  }

  editarIngreso(ingreso: any) {
    console.log('Editar ingreso:', ingreso);
    // Aquí abrirías el formulario con los datos del ingreso seleccionado
  }

  eliminarIngreso(ingreso: any) {
    console.log('Eliminar ingreso:', ingreso);
    // Aquí podrías mostrar una confirmación antes de eliminarlo
  }
}
