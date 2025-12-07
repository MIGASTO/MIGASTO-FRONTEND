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

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipo_categoria: [2, [Validators.required]], 
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {

      const categoriaId = this.data.tipo_categoria === 'ingreso' ? 1 : 2;

      this.form.patchValue({
        nombre: this.data.nombre,
        tipo_categoria: categoriaId, 
      });
    }
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload = {
        id_categoria: formValue.tipo_categoria,
        nombre: formValue.nombre 
      };

      this.dialogRef.close(payload);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}