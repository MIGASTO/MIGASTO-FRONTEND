import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { Footer } from '../../components/footer/footer';
import { AbonoModal } from '../../components/formularios/abono-modal/abono-modal';
import { HistorialAbonosModal } from '../../components/historial-abonos-modal/historial-abonos-modal';
import { Navbar } from '../../components/navbar/navbar';
import { Prestamo, PrestamosService } from '../../services/prestamos.service';

import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar, AbonoModal, HistorialAbonosModal, Footer, MatIconModule],
  templateUrl: './prestamos.html',
})
export class Prestamos implements OnInit {
  private fb = inject(FormBuilder);
  private prestamosService = inject(PrestamosService);
  private alertService = inject(AlertService);
  

  prestamos: Prestamo[] = [];
  loading = false;
  prestamoSeleccionado: Prestamo | null = null;
  historialIdSeleccionado: number | null = null;

  prestamoForm = this.fb.group({
    prestamista: ['', [Validators.required]],
    monto_total: ['', [Validators.required, Validators.min(1)]],
    fecha_limite: ['', [Validators.required]],
    descripcion: ['']
  });

  ngOnInit() {
    this.cargarPrestamos();
  }

  cargarPrestamos() {
    this.loading = true;
    
    this.prestamosService.getPrestamosDetails().subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.prestamos = response.data;
        } 
        else if (Array.isArray(response)) {
          this.prestamos = response;
        }
        else {
          this.prestamos = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Error cargando préstamos", err);
        this.prestamos = [];
        this.loading = false;
      }
    });
  }

  guardarPrestamo() {
    if (this.prestamoForm.invalid) return;

    this.loading = true;
    const nuevo: Prestamo = {
      prestamista: this.prestamoForm.value.prestamista!,
      monto_total: this.prestamoForm.value.monto_total!,
      fecha_limite: this.prestamoForm.value.fecha_limite!,
      descripcion: this.prestamoForm.value.descripcion || ''
    };

    this.prestamosService.crearPrestamo(nuevo).subscribe({
      next: () => {
        this.alertService.exito('Préstamo creado correctamente');
        this.prestamoForm.reset();
        this.cargarPrestamos(); 
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.alertService.confirmar({
            titulo: 'ERROR',
            mensaje: 'No se pudo crear el préstamo. Intente nuevamente.',
            tipo: 'update'
        });
      }
    });
  }

  eliminarPrestamo(id: number) {
    this.alertService.confirmar({
        titulo: '¿ELIMINAR PRÉSTAMO?',
        mensaje: 'Se borrará el préstamo y todo su historial de abonos. Esta acción no se puede deshacer.',
        tipo: 'delete'
    }).subscribe((confirmado) => {
        if (confirmado) {
            this.prestamosService.eliminarPrestamo(id).subscribe(() => {
                this.alertService.eliminado('Préstamo eliminado permanentemente');
                this.cargarPrestamos();
            });
        }
    });
  }

  abrirModalAbono(prestamo: Prestamo) {
    this.prestamoSeleccionado = prestamo;
  }

  cerrarModal() {
    this.prestamoSeleccionado = null;
  }

  onAbonoExitoso() {
    this.cerrarModal();
    this.alertService.exito('Abono registrado con éxito');
    this.cargarPrestamos(); 
  }

  calcularPorcentaje(p: Prestamo): number {
    const total = Number(p.monto_total);
    const pagado = Number(p.monto_pagado || 0);
    if (total === 0) return 0;
    return (pagado / total) * 100;
  }

  abrirHistorial(id: number) {
    this.historialIdSeleccionado = id;
  }

  cerrarHistorial() {
    this.historialIdSeleccionado = null;
  }
  
  onHistorialChange() {
    this.cargarPrestamos();
  }
}