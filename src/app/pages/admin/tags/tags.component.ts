import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsService } from '../../../services/tags.service';
import { Navbar } from '../../../components/navbar/navbar';
import { RouterModule } from '@angular/router';

// Imports de Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Importamos el Modal
import { TagModal} from '../../../components/tag-modal/tag-modal';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    CommonModule, Navbar, RouterModule,
    MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule
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
      maxWidth: '400px', // Modal compacto para Tags
      panelClass: 'custom-dialog-container',
      data: tag // Si es undefined = Crear, Si es objeto = Editar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (tag) {
          // Lógica de ACTUALIZAR (Usando el nuevo método del servicio)
          this.service.updateTag(tag.id_tag, result).subscribe(() => this.cargarTags());
        } else {
          // Lógica de CREAR
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