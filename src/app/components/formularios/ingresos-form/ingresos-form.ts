import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ingreso-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ingresos-form.html',
})
export class IngresoForm {
  @Input() ingresoEditado: any = null;
  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  monedas: any[] = [];
  tagsDisponibles: any[] = [];

  ingreso = {
    id_movimiento: null,
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    id_categoria: 1, 
    id_moneda: null,
    tags: [] as number[],
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarListas();
  }

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

  cargarListas() {
    this.http.get('http://localhost:8080/api/monedas').subscribe({
      next: (res: any) => (this.monedas = res),
      error: (err) => console.error('Error al cargar monedas:', err),
    });

    this.http.get('http://localhost:8080/api/tags').subscribe({
      next: (res: any) => (this.tagsDisponibles = res),
      error: (err) => console.error('Error al cargar tags:', err),
    });
  }

  guardarIngreso() {
    const datos = {
      descripcion: this.ingreso.descripcion?.trim(),
      monto: this.ingreso.monto,
      fecha: this.ingreso.fecha,
      id_categoria: this.ingreso.id_categoria,
      id_moneda: this.ingreso.id_moneda,
      tags: this.ingreso.tags ?? [],
    };

    this.guardar.emit({ ...this.ingreso, ...datos });
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
      id_moneda: null,
      tags: [],
    };
  }
}
