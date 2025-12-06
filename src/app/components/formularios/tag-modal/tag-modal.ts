import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tag-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './tag-modal.html',
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { margin-bottom: 0.5rem; }
  `]
})
export class TagModal {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TagModal>);

  // Definición del formulario con el nuevo campo y validación
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    // 1=Ingreso, 2=Gasto. Asumimos 2 por defecto.
    tipo_categoria: [2, [Validators.required]], 
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      // Para la EDICIÓN, necesitamos determinar qué ID de categoría tiene el tag actual.
      // El API devuelve 'tipo_categoria' como string ("gasto" o "ingreso").
      const categoriaId = this.data.tipo_categoria === 'ingreso' ? 1 : 2;

      this.form.patchValue({
        nombre: this.data.nombre,
        tipo_categoria: categoriaId, // Usamos el ID para el select
      });
    }
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Mapeo del ID a los datos que el API espera:
      // Tu API espera: { id_categoria: 2, nombre: "abono" }
      const payload = {
        id_categoria: formValue.tipo_categoria, // 1 ó 2
        nombre: formValue.nombre // Ej: "abono"
      };

      this.dialogRef.close(payload);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}