

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos-form.html',
})
export class GastoForm {
  @Input() gastoEditado: any = null; // 👈 recibe el gasto a editar
  @Output() guardar = new EventEmitter<any>(); // 👈 emite cuando se guarda
  @Output() cancelar = new EventEmitter<void>(); // 👈 emite al cancelar

  gasto = {
    id: null,
    descripcion: '',
    monto: 0,
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
  };

  ngOnChanges() {
    if (this.gastoEditado) {
      this.gasto = { ...this.gastoEditado };
    } else {
      this.resetForm();
    }
  }

  guardarGasto() {
    this.guardar.emit(this.gasto);
    this.resetForm();
  }

  cancelarEdicion() {
    this.cancelar.emit();
    this.resetForm();
  }

  resetForm() {
    this.gasto = {
      id: null,
      descripcion: '',
      monto: 0,
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
    };
  }
}
