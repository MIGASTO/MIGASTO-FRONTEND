import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TagsService } from '../../../services/tags.service';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './gastos-form.html',
})
export class GastoForm implements OnInit {
  
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

  constructor(
    private http: HttpClient,
    private tagsService: TagsService,
    public dialogRef: MatDialogRef<GastoForm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.cargarListas();

    if (this.data) {
      this.gasto = {
        ...this.data,
        descripcion: this.data.descripcion || '',
        id_moneda: this.data.id_moneda ?? null,
        tags: Array.isArray(this.data.tags)
          ? this.data.tags.map((t: any) => t.id_tag || t)
          : [],
      };
    }
  }

  cargarListas() {
    this.http.get('http://localhost:8080/api/monedas').subscribe({
      next: (res: any) => (this.monedas = res),
      error: (err) => console.error('Error monedas:', err),
    });

    this.tagsService.getTagsGastos().subscribe({
      next: (res: any) => (this.tagsDisponibles = res),
      error: (err) => console.error('Error tags:', err),
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
    this.dialogRef.close({ ...this.gasto, ...datos });
  }

  cancelarEdicion() {
    this.dialogRef.close(null);
  }
}