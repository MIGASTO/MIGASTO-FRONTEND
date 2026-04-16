import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertaComponent } from '../components/shared/alertAdmin/alert.component';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private dialog: MatDialog) {}

  confirmar(data: { titulo: string; mensaje: string; tipo: 'success' | 'update' | 'delete'; }): Observable<boolean> {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '100%',
      maxWidth: '420px',
      panelClass: 'custom-alert',
      disableClose: true, 
      data,
    });
    return dialogRef.afterClosed();
  }

  exito(mensaje: string,duracion: number = 1100) {
    this.dialog.open(AlertaComponent, {
      width: '100%',
      maxWidth: '420px',
      data: {
        titulo: '¡ÉXITO!',
        mensaje,
        tipo: 'success',
        duracion: duracion
      },
    });
  }

  actualizado(mensaje: string, duracion: number= 1100) {
    this.dialog.open(AlertaComponent, {
      width: '100%',
      maxWidth: '420px',
      data: {
        titulo: 'ACTUALIZADO',
        mensaje,
        tipo: 'success',
        duracion: duracion
      },
    });
  }

  eliminado(mensaje: string, duracion: number= 1100) {
    this.dialog.open(AlertaComponent, {
      width: '100%',
      maxWidth: '420px',
      data: {
        titulo: 'ELIMINADO',
        mensaje,
        tipo: 'success',
        visual: 'deleted',
        duracion: duracion
      },
    });
  }
}