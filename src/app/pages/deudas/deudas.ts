import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { PagoCuotaModal } from '../pago-cuota/pago-cuota'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-deudas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar, PagoCuotaModal], 
  templateUrl: './deudas.html',
})
export class Deudas {
  private fb = inject(FormBuilder);

  // Controla qué deuda se está pagando (null = modal cerrado)
  deudaSeleccionada: any = null;

  deudaForm = this.fb.group({
    prestamista: ['', [Validators.required, Validators.minLength(3)]],
    montoTotal: ['', [Validators.required, Validators.min(1)]],
    fechaLimite: ['', [Validators.required]],
    descripcion: ['']
  });

  // Datos de ejemplo
  listaDeudas: any[] = [
    { 
      id: 1, 
      prestamista: 'Banco XYZ', 
      montoTotal: 1500000, 
      montoPagado: 500000, 
      fechaLimite: '2025-12-01', 
      descripcion: 'Préstamo libre inversión' 
    },
    { 
      id: 2, 
      prestamista: 'Juan Pérez', 
      montoTotal: 200000, 
      montoPagado: 0, 
      fechaLimite: '2025-11-15', 
      descripcion: 'Prestamo personal' 
    }
  ];

  agregarDeuda() {
    if (this.deudaForm.invalid) {
      this.deudaForm.markAllAsTouched();
      return;
    }

    const nuevaDeuda = {
      id: Date.now(),
      prestamista: this.deudaForm.value.prestamista,
      montoTotal: this.deudaForm.value.montoTotal,
      montoPagado: 0,
      fechaLimite: this.deudaForm.value.fechaLimite,
      descripcion: this.deudaForm.value.descripcion
    };

    this.listaDeudas.unshift(nuevaDeuda);
    this.deudaForm.reset();
  }

  eliminarDeuda(id: number) {
    if(confirm('¿Estás seguro de eliminar esta deuda?')) {
        this.listaDeudas = this.listaDeudas.filter(d => d.id !== id);
    }
  }

  // --- LÓGICA DEL MODAL ---

  abrirModalPago(deuda: any) {
    this.deudaSeleccionada = deuda;
  }

  cerrarModal() {
    this.deudaSeleccionada = null;
  }

  procesarPago(monto: number) {
    if (this.deudaSeleccionada) {
      // Actualizamos la deuda en la lista local
      const deuda = this.listaDeudas.find(d => d.id === this.deudaSeleccionada.id);
      if (deuda) {
        deuda.montoPagado += monto;
      }

      this.cerrarModal();
      console.log(`Pago de $${monto} procesado`);
    }
  }
}