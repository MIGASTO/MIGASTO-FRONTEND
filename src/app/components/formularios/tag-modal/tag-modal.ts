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
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}