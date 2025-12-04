import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.minLength(3)]]
    });
  }

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]]
  });

  guardar() {
    if (this.form.valid) {
      // Retornamos el valor. Opcional: forzar minúsculas o mayúsculas aquí si el backend no lo hace.
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}