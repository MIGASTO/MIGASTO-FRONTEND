import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-tags-form-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIcon],
  templateUrl: './tags-form-user.html',
})
export class TagsFormUser implements OnInit {

  tag = {
    id_tag: null,
    nombre: '',
    id_categoria: 2 
  };

  constructor(
    public dialogRef: MatDialogRef<TagsFormUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.tag = { 
        ...this.data,
        id_categoria: Number(this.data.id_categoria) || 2 
      };
    }
  }

  guardarTag() {
    if (!this.tag.nombre.trim()) return;
    this.dialogRef.close(this.tag);
  }

  cancelarEdicion() {
    this.dialogRef.close(null);
  }
}