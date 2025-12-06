import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Footer } from '../../../components/footer/footer';
import { Navbar } from '../../../components/navbar/navbar';
import { BalanceService } from '../../../services/balance.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-general',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar,
    MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule, Footer],
  templateUrl: './dashboard-general.html',
})
export class DashboardGeneral implements OnInit, AfterViewInit {
  @ViewChild('comparisonCanvas') comparisonCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('balanceCanvas') balanceCanvas!: ElementRef<HTMLCanvasElement>;

  private chartComparisonInstance: Chart | null = null;
  private chartBalanceInstance: Chart | null = null;

  totalIngresos = 0;
  totalGastos = 0;
  balanceTotal = 0;
  ahorroPorcentaje = 0;

  ultimosMovimientos: any[] = [];

  cargando = true;

  constructor(
    private balanceService: BalanceService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    Chart.defaults.color = '#2d2d2e'; 
    Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.05)'; 
    Chart.defaults.font.family = "'Inter', 'Helvetica', sans-serif"; 
    
    this.cargarDatosGenerales();
  }

  ngAfterViewInit() {}

  cargarDatosGenerales() {
    this.cargando = true;

    forkJoin({
      ingresos: this.balanceService.obtenerEstadisticasIngresos(),
      gastos: this.balanceService.obtenerEstadisticasGastos()
    }).subscribe({
      next: (res) => {
        console.log('✅ Datos recibidos correctamente:', res);

        this.totalIngresos = res.ingresos.total || 0;
        this.totalGastos = res.gastos.total || 0;
        this.balanceTotal = this.totalIngresos - this.totalGastos;

        if (this.totalIngresos > 0) {
          this.ahorroPorcentaje = ((this.totalIngresos - this.totalGastos) / this.totalIngresos) * 100;
        } else {
          this.ahorroPorcentaje = 0;
        }

        const topIngresos = (res.ingresos.top5 || []).map((i: any) => ({...i, tipo: 'ingreso'}));
        const topGastos = (res.gastos.top5 || []).map((g: any) => ({...g, tipo: 'gasto'}));

        this.ultimosMovimientos = [...topIngresos, ...topGastos]
          .sort((a, b) => b.monto - a.monto)
          .slice(0, 5); 

        this.cargando = false;
        this.cdr.detectChanges();

        this.renderBalanceChart(this.totalIngresos, this.totalGastos);

        this.renderComparisonChart(res.ingresos.graficoMensual || [], res.gastos.graficoMensual || []);
      },
      error: (err) => {
        console.error('❌ Error cargando dashboard general:', err);
        this.cargando = false;
        this.renderBalanceChart(0, 0);
        this.cdr.detectChanges();
      }
    });
  }

  renderBalanceChart(ingresos: number, gastos: number) {
    if (!this.balanceCanvas) return;
    if (this.chartBalanceInstance) this.chartBalanceInstance.destroy();

    const saldo = Math.max(0, ingresos - gastos);

    this.chartBalanceInstance = new Chart(this.balanceCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Gastos', 'Disponible'],
        datasets: [{
          data: [gastos, saldo],
          backgroundColor: [
            '#ef4444', 
            '#10b981'  
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribución' }
        }
      }
    });
  }

  renderComparisonChart(dataIngresos: any[], dataGastos: any[]) {
    if (!this.comparisonCanvas) return;
    if (this.chartComparisonInstance) this.chartComparisonInstance.destroy();

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const valoresIngresos = new Array(12).fill(0);
    const valoresGastos = new Array(12).fill(0);

    dataIngresos.forEach(item => {
        if(item.mes >= 1 && item.mes <= 12) valoresIngresos[item.mes - 1] = item.total;
    });

    dataGastos.forEach(item => {
        if(item.mes >= 1 && item.mes <= 12) valoresGastos[item.mes - 1] = item.total;
    });

    this.chartComparisonInstance = new Chart(this.comparisonCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Ingresos',
            data: valoresIngresos,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Gastos',
            data: valoresGastos,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: 'Comparativa Mensual' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}