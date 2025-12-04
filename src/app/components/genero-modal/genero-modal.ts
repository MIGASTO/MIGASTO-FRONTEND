import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-genero-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './genero-modal.html', // <--- Apunta al archivo HTML
  styles: [`
    /* Pequeño ajuste CSS para quitar el espacio inferior extra de los Inputs de Material */
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { 
      margin-bottom: 0.5rem; 
    }
  `]
})
export class GeneroModal {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GeneroModal>);

  // Inyectamos la data (si es null es CREAR, si tiene objeto es EDITAR)
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      nombre: [this.data ? this.data.nombre : '', [Validators.required]]
    });
  }

  form = this.fb.group({
    nombre: ['', [Validators.required]]
  });

  guardar() {
    if (this.form.valid) {
      // Retornamos el valor del formulario al cerrar
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}