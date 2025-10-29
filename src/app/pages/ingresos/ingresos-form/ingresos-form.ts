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
    id_movimiento: null,
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    id_categoria: 1,
    id_moneda:1,
    tags:[1] as number[],
    
  };

  ngOnChanges() {
    if (this.ingresoEditado) {
      this.ingreso = {
         ...this.ingresoEditado,
         descripcion: this.ingresoEditado.descripcion || '',
         id_moneda: this.ingresoEditado.id_moneda ?? null,
        tags: Array.isArray(this.ingresoEditado.tags)
          ? this.ingresoEditado.tags
          : this.ingresoEditado.tags
          ? [this.ingresoEditado.tags]
          : [],
      };
    } else {
      this.resetForm();
    }
  }

  guardarIngreso() {

    const datos = {
      monto: this.ingreso.monto,
      fecha: this.ingreso.fecha,
      id_categoria: this.ingreso.id_categoria,
      descripcion: this.ingreso.descripcion?.trim() || undefined,
      id_moneda: this.ingreso.id_moneda ?? null,
      tags: Array.isArray(this.ingreso.tags)
      ? this.ingreso.tags
      : this.ingreso.tags
      ? [this.ingreso.tags]
      : [],
    };
    this.guardar.emit({...this.ingreso, ...datos,});
    this.resetForm();
  }

  cancelarEdicion() {
    this.cancelar.emit();
    this.resetForm();
  }

  resetForm() {
    this.ingreso = {
      id_movimiento: null,
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0],
      id_categoria: 1,
      id_moneda:1,
      tags:[1],
    };
  }
}
