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
    fuente: '',
    fecha: new Date().toISOString().split('T')[0],
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
      fuente: '',
      fecha: new Date().toISOString().split('T')[0],
    };
  }
}
