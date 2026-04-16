import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TagsService } from '../../../services/tags.service';

@Component({
  selector: 'app-ingreso-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './ingresos-form.html',
})
export class IngresoForm implements OnInit {
  
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

  constructor(
    private http: HttpClient,
    private tagsService: TagsService,
    public dialogRef: MatDialogRef<IngresoForm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.cargarListas();

    if (this.data) {
      this.ingreso = {
        ...this.data,
        descripcion: this.data.descripcion || '',
        id_moneda: this.data.id_moneda ?? null,
        // Aseguramos que los tags sean IDs numéricos
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

    this.tagsService.getTagsIngresos().subscribe({
      next: (res: any) => (this.tagsDisponibles = res),
      error: (err) => console.error('Error tags:', err),
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

    this.dialogRef.close({ ...this.ingreso, ...datos });
  }

  cancelarEdicion() {
    this.dialogRef.close(null);
  }
}