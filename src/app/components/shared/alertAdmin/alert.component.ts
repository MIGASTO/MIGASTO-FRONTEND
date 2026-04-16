import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core'; 
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'], 
  imports: [CommonModule, MatIconModule],
})
export class AlertaComponent implements OnInit { 
  titulo: string;
  mensaje: string;
  tipo: 'success' | 'update' | 'delete';
  duracion?: number; 

  constructor(
    public dialogRef: MatDialogRef<AlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titulo = data.titulo;
    this.mensaje = data.mensaje;
    this.tipo = data.tipo;
    this.duracion = data.duracion; 
  }

  ngOnInit(): void {
    if (this.tipo === 'success' && this.duracion) {
      setTimeout(() => {
        this.dialogRef.close(true);
      }, this.duracion);
    }
  }

  cerrar(resultado: boolean) {
    this.dialogRef.close(resultado);
  }
}