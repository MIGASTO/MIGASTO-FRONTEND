import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { TagsFormUser } from '../../components/formularios/tags-form-user/tags-form-user';
import { Navbar } from '../../components/navbar/navbar';
import { AlertService } from '../../services/alert.service';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-tags-user',
  standalone: true,
  imports: [
    CommonModule, Navbar, Footer, RouterModule, 
    MatIconModule, MatDialogModule
  ],
  templateUrl: './tags-user.html',
})
export class TagsUser implements OnInit {
  private service = inject(TagsService);
  private dialog = inject(MatDialog);
  private alertService = inject(AlertService);

  tags: any[] = [];
  loading = false;

  ngOnInit() {
    this.cargarTags();
  }

  cargarTags() {
    this.loading = true;
    this.service.getTags().subscribe({
      next: (data) => {
        this.tags = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  abrirModal(tag?: any) {
    const dialogRef = this.dialog.open(TagsFormUser, {
      width: '100%',
      maxWidth: '450px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: tag ? { ...tag } : null 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarTag(result, tag?.id_tag);
      }
    });
  }

  // CORRECCIÓN PRINCIPAL AQUÍ 👇
  guardarTag(datosFormulario: any, idTagExistente?: number) {
    
    // Creamos el payload INCLUYENDO id_categoria
    const payload = {
        nombre: datosFormulario.nombre,
        id_categoria: Number(datosFormulario.id_categoria) // <--- ESTO FALTABA
    };

    if (idTagExistente) {
      // --- ACTUALIZAR ---
      this.service.updateTag(idTagExistente, payload).subscribe({
        next: () => {
          this.alertService.actualizado('Etiqueta actualizada correctamente.');
          this.cargarTags();
        },
        error: (err) => this.manejarError(err)
      });
    } else {
      // --- CREAR ---
      this.service.createTag(payload).subscribe({
        next: () => {
          this.alertService.exito('Nueva etiqueta creada con éxito.');
          this.cargarTags();
        },
        error: (err) => this.manejarError(err)
      });
    }
  }

  eliminar(tag: any) {
    this.alertService.confirmar({
        titulo: '¿Eliminar etiqueta?',
        mensaje: `Se eliminará "${tag.nombre}". Esta acción no se puede deshacer.`,
        tipo: 'delete'
    }).subscribe(confirmado => {
        if (confirmado) {
            this.service.deleteTag(tag.id_tag).subscribe({
                next: () => {
                    this.alertService.eliminado('La etiqueta fue eliminada permanentemente.');
                    this.cargarTags();
                },
                error: (err) => this.manejarError(err)
            });
        }
    });
  }

  private manejarError(err: any) {
    console.error(err);
    const mensaje = err.error?.message || 'Ocurrió un error inesperado.';
    this.alertService.confirmar({
      titulo: 'ERROR',
      mensaje: Array.isArray(mensaje) ? mensaje[0] : mensaje,
      tipo: 'update'
    });
  }
}