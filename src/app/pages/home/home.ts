import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { BalanceService, BalanceSummary } from '../../services/balance.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, HttpClientModule], 
  templateUrl: './home.html',
})
export class Home implements OnInit {
  
  resumen: BalanceSummary | null = null;
  loading: boolean = true; 
  error: string | null = null; 

  constructor(private balanceService: BalanceService) {} 

  ngOnInit() {
    this.cargarResumen();
  }


  get balanceMessage(): string {
    if (!this.resumen) return '';
    
    if (this.resumen.balance > 0) {
      return '¡Estás en verde! Excelente manejo de tus finanzas.';
    } else if (this.resumen.balance < 0) {
      return '¡Atención! Estás en números rojos. Es hora de revisar tus gastos.';
    } else {
      return 'Tu balance es cero. Mantente vigilante.';
    }
  }

  cargarResumen() {
    this.loading = true;
    this.error = null;

    this.balanceService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener el resumen:', err);
        this.error = err.error?.message || 'Error desconocido al cargar el resumen.';
        this.loading = false;
      },
    });
  }
}