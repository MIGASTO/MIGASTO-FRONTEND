import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbonoService } from '../../../services/abono.service';
import { Prestamo, PrestamosService } from '../../../services/prestamos.service';

@Component({
  selector: 'app-historial-abonos-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-abonos-modal.html',
})
export class HistorialAbonosModal implements OnInit {
  @Input() prestamoId!: number; // Recibimos solo el ID para buscar la data fresca
  @Output() cerrar = new EventEmitter<void>();
  @Output() cambioRealizado = new EventEmitter<void>(); // Para avisar que se recargue la tabla principal

  private prestamosService = inject(PrestamosService);
  private abonoService = inject(AbonoService);

  prestamo: Prestamo | null = null;
  abonos: any[] = [];
  loading = true;
  
  // Control de edición
  editandoId: number | null = null;
  montoEdicion: number = 0;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    console.log("🔍 Buscando historial para ID:", this.prestamoId);

    this.prestamosService.getPrestamoById(this.prestamoId).subscribe({
      next: (response: any) => {
        console.log("📦 Respuesta del Backend (Historial):", response);

        // 1. Normalizamos la respuesta (si viene en .data, la sacamos)
        const dataReal = response.data || response;
        
        this.prestamo = dataReal;

        // 2. Extraemos los abonos con seguridad
        const listaAbonos = dataReal.abonos || [];

        // 3. Ordenamos (del más reciente al más antiguo)
        this.abonos = listaAbonos.sort((a: any, b: any) => 
          new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
        );

        console.log("✅ Abonos encontrados:", this.abonos.length);
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Error cargando historial:", err);
        this.loading = false;
        alert('Error al cargar el historial');
        this.cerrar.emit();
      }
    });
  }

  // --- EDITAR ---
  iniciarEdicion(abono: any) {
    this.editandoId = abono.id_abono;
    this.montoEdicion = Number(abono.monto);
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.montoEdicion = 0;
  }

  guardarEdicion(abono: any) {
    if (this.montoEdicion <= 0) return alert("El monto debe ser mayor a 0");
    if (this.montoEdicion === abono.monto) {
      this.cancelarEdicion();
      return;
    }

    if (!confirm(`¿Confirmar cambio de monto de $${abono.monto} a $${this.montoEdicion}?`)) return;

    this.abonoService.actualizarAbono(abono.id_abono, this.montoEdicion).subscribe({
      next: () => {
        alert('Abono actualizado correctamente');
        this.cancelarEdicion();
        this.cargarDatos(); // Recargar lista local
        this.cambioRealizado.emit(); // Avisar al padre para actualizar saldos
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + (err.error?.message || 'No se pudo actualizar'));
      }
    });
  }

  // --- ELIMINAR ---
  eliminarAbono(id: number, monto: number) {
    if (!confirm(`¿Estás seguro de ELIMINAR este abono de $${monto}?\nEsto aumentará la deuda pendiente.`)) return;

    this.abonoService.eliminarAbono(id).subscribe({
      next: () => {
        this.cargarDatos();
        this.cambioRealizado.emit();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar');
      }
    });
  }
}