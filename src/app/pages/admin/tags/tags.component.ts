import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { TagsService } from '../../../services/tags.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Footer } from '../../../components/footer/footer';
import { TagModal } from '../../../components/formularios/tag-modal/tag-modal';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    CommonModule, AdminNavbarComponent, RouterModule,
    MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule, Footer
  ],
  templateUrl: './tags.component.html',
})
export class TagsComponent implements OnInit {
  private service = inject(TagsService);
  private dialog = inject(MatDialog);
  private alertService = inject(AlertService);

  tags: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
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
      error: () => this.loading = false
    });
  }

  abrirModal(tag?: any) {
    const dialogRef = this.dialog.open(TagModal, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'custom-dialog-container',
      data: tag 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (tag) {
          this.service.updateTag(tag.id_tag, result).subscribe({
            next: () => {
              this.alertService.actualizado('Tag actualizado correctamente.');
              this.cargarTags();
            }
          }
          );
        } else {
          this.service.createTag(result).subscribe({
            next: () => {
              this.alertService.exito('Nuevo tag creado con éxito.');
              this.cargarTags();
            },
            error: (err) => console.error(err)
          });
        }
      }
    });
  }

  eliminar(id: number) {
    this.alertService.confirmar({
        titulo: '¿Eliminar tag?',
        mensaje: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
        tipo: 'delete'
    }).subscribe(confirmado => {
        if (confirmado) {
            this.service.deleteTag(id).subscribe(() => {
                this.alertService.eliminado('El tag fue eliminado permanentemente.');
                this.cargarTags();
            });
        }
    });
  }
}