import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  monedas: any[] = [];
  tagsDisponibles: any[] = [];

  gasto = {
    id_movimiento: null,
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    id_categoria: 2,
    id_moneda: null,
    tags: [] as number[],
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarListas();
  }

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

  guardarGasto() {
    const datos = {
      descripcion: this.gasto.descripcion?.trim(),
      monto: this.gasto.monto,
      fecha: this.gasto.fecha,
      id_categoria: this.gasto.id_categoria,
      id_moneda: this.gasto.id_moneda,
      tags: this.gasto.tags ?? [],
    };

    this.guardar.emit({ ...this.gasto, ...datos });
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
      id_moneda: null,
      tags: [],
    };
  }
}
