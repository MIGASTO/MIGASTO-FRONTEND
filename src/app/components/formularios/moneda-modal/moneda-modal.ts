import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-moneda-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './moneda-modal.html',
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { margin-bottom: 0.5rem; }
  `]
})
export class MonedaModal {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MonedaModal>);
  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(3)]],
    simbolo: ['', Validators.required],
    tasa_cambio: ['', [Validators.required, Validators.min(0)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.form.patchValue({
        codigo: this.data.codigo,
        simbolo: this.data.simbolo,
        tasa_cambio: this.data.tasa_cambio
      });
    }
  }

  guardar() {
    if (this.form.valid) {
      const value = {
        ...this.form.value,
        codigo: this.form.value.codigo?.toUpperCase()
      };
      this.dialogRef.close(value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}