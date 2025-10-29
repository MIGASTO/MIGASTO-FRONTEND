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
  @Input() gastoEditado: any = null; 
  @Output() guardar = new EventEmitter<any>(); 
  @Output() cancelar = new EventEmitter<void>();

  gasto = {
    id_movimiento: null,
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    id_categoria: 2,
    id_moneda:1,
    tags:[1] as number[],
  };

  ngOnChanges() {
    if (this.gastoEditado) {
      this.gasto = {
         ...this.gastoEditado,
         descripcion: this.gastoEditado.descripcion || '',
         id_moneda: this.gastoEditado.id_moneda ?? null,
        tags: Array.isArray(this.gastoEditado.tags)
          ? this.gastoEditado.tags
          : this.gastoEditado.tags
          ? [this.gastoEditado.tags]
          : [],
      };
    } else {
      this.resetForm();
    }
  }

  guardarGasto() {
    const datos = {
      monto: this.gasto.monto,
      fecha: this.gasto.fecha,
      id_categoria: this.gasto.id_categoria,
      descripcion: this.gasto.descripcion?.trim() || undefined,
      id_moneda: this.gasto.id_moneda ?? null,
      tags: Array.isArray(this.gasto.tags)
      ? this.gasto.tags
      : this.gasto.tags
      ? [this.gasto.tags]
      : [],
    };
    this.guardar.emit({...this.gasto, ...datos});
    this.resetForm();
  }

  cancelarEdicion() {
    this.cancelar.emit();
    this.resetForm();
  }

  resetForm() {
    this.gasto = {
      id_movimiento: null,
      descripcion: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0],
      id_categoria: 2,
      id_moneda:1,
      tags:[1],
    };
  }
}
