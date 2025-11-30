import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago-cuota-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pago-cuota.html',
})
export class PagoCuotaModal implements OnInit {
  @Input() deuda: any; 
  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<number>();

  montoControl = new FormControl(0, [Validators.required, Validators.min(1)]);
  restante: number = 0;

  ngOnInit() {
    this.restante = this.deuda.montoTotal - this.deuda.montoPagado;
    this.montoControl.addValidators(Validators.max(this.restante));
  }

  pagarTotalidad() {
    this.montoControl.setValue(this.restante);
  }

  confirmarPago() {
    if (this.montoControl.valid && this.montoControl.value) {
      this.confirmar.emit(this.montoControl.value);
    }
  }
}