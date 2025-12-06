import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { TagsService } from '../../../services/tags.service';

// Imports de Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

// Importamos el Modal
import { Footer } from '../../../components/footer/footer';
import { TagModal } from '../../../components/formularios/tag-modal/tag-modal';

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
          this.service.updateTag(tag.id_tag, result).subscribe(() => this.cargarTags());
        } else {
          this.service.createTag(result).subscribe(() => this.cargarTags());
        }
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta etiqueta global?')) {
      this.service.deleteTag(id).subscribe(() => this.cargarTags());
    }
  }
}