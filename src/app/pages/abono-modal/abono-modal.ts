import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbonoService } from '../../services/abono.service';
import { Prestamo } from '../../services/prestamos.service';

@Component({
  selector: 'app-abono-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './abono-modal.html',
})
export class AbonoModal implements OnInit {
  @Input() prestamo!: Prestamo;
  @Output() cancelar = new EventEmitter<void>();
  @Output() abonoRealizado = new EventEmitter<void>();

  private abonoService = inject(AbonoService);

  montoControl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);
  
  saldoPendiente: number = 0;
  loading = false;
  
  step: 'FORM' | 'QUESTION' = 'FORM';
  recordarDecision = false;
  
  preferenciaGuardada: string | null = null;
  
  private idAbonoReciente: number | null = null;

  ngOnInit() {
    this.saldoPendiente = Number(this.prestamo.monto_restante || 0);
    this.montoControl.addValidators(Validators.max(this.saldoPendiente));

    this.preferenciaGuardada = localStorage.getItem('PREF_GASTO_AUTO');
  }

  eliminarPreferencia() {
    localStorage.removeItem('PREF_GASTO_AUTO');
    this.preferenciaGuardada = null;
    this.recordarDecision = false; 
  }

  pagarTotalidad() {
    this.montoControl.setValue(this.saldoPendiente);
  }

  confirmarAbono() {
    if (this.montoControl.invalid || !this.montoControl.value) return;

    const idPrestamo = this.prestamo.id_prestamo; 
    const monto = this.montoControl.value;

    if (!idPrestamo) return;

    this.loading = true;

    this.abonoService.crearAbono(idPrestamo, monto).subscribe({
      next: (res: any) => {
        console.log('✅ Abono registrado:', res);
        this.loading = false;
        
        if (res.data && res.data.id_abono) {
            this.idAbonoReciente = res.data.id_abono;
        } 
        else if (res.abono && res.abono.id_abono) {
            this.idAbonoReciente = res.abono.id_abono;
        }
        else if (res.id_abono) {
            this.idAbonoReciente = res.id_abono;
        }

        this.verificarPreferenciaGasto();
      },
      error: (err) => {
        console.error('Error al abonar', err);
        this.loading = false;
        alert('Error: ' + (err.error?.message || 'No se pudo registrar el abono'));
      }
    });
  }

  verificarPreferenciaGasto() {

    const preferencia = localStorage.getItem('PREF_GASTO_AUTO'); 

    if (preferencia === 'SI') {
      this.llamarAlBackendParaGasto();
    } else if (preferencia === 'NO') {
      this.cerrarTodo();
    } else {
      this.step = 'QUESTION';
    }
  }

  responderPregunta(respuesta: 'SI' | 'NO') {
    if (this.recordarDecision) {
      localStorage.setItem('PREF_GASTO_AUTO', respuesta);
    }

    if (respuesta === 'SI') {
      this.llamarAlBackendParaGasto();
    } else {
      this.cerrarTodo();
    }
  }

  llamarAlBackendParaGasto() {
    if (!this.idAbonoReciente) {
        this.cerrarTodo(); 
        return;
    }

    this.loading = true;

    this.abonoService.generarGasto(this.idAbonoReciente).subscribe({
      next: (res) => {
        this.cerrarTodo();
      },
      error: (err) => {
        console.error('❌ Error generando gasto', err);
        this.loading = false;
        this.cerrarTodo();
      }
    });
  }

  cerrarTodo() {
    this.abonoRealizado.emit();
  }
}