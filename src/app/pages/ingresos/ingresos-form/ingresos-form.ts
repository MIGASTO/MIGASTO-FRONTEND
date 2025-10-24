// src/app/pages/ingresos/ingresos-form/ingresos-form.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingreso-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingresos-form.html',
})
export class IngresoForm {
  @Input() ingresoEditado: any = null;
  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  ingreso = {
    id: null,
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    id_categoria: 1, // 👈 por ahora fija una categoría de prueba
    id_moneda: 1,    // 👈 moneda por defecto (ej: COP)
    tags: [],
    id_usuario: 1,   // 👈 usuario fijo (ajústalo según autenticación)
  };

  ngOnChanges() {
    if (this.ingresoEditado) {
      this.ingreso = { ...this.ingresoEditado };
    } else {
      this.resetForm();
    }
  }

  guardarIngreso() {
    this.guardar.emit(this.ingreso);
    this.resetForm();
  }

  cancelarEdicion() {
    this.cancelar.emit();
    this.resetForm();
  }

  resetForm() {
    this.ingreso = {
      id: null,
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0],
      id_categoria: 1,
      id_moneda: 1,
      tags: [],
      id_usuario: 1,
    };
  }
}
