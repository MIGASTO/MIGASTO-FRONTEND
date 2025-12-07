import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Navbar } from '../../../components/navbar/navbar';
import { BalanceService } from '../../../services/balance.service';
import { GastosService } from '../../../services/gasto.service';
import { Footer } from '../../footer/footer';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-gastos',
  standalone: true,
  imports: [CommonModule, Footer, RouterModule, Navbar, MatTableModule, MatIconModule, MatButtonModule, 
    MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './dashboard-gastos.html',
  styleUrls: ['./dashboard-gastos.css']
})
export class DashboardGastos implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  private chartPieInstance: Chart | null = null;
  private chartLineInstance: Chart | null = null;
  private chartBarInstance: Chart | null = null;

  totalGastos = 0;
  promedioGastos = 0;
  gastoMayor: any = null;
  cantidadGastos = 0;
  cargando = true;

  constructor(
    private balanceService: BalanceService,
    private gastosService: GastosService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    Chart.defaults.color = '#2d2d2e'; 
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)'; 
    Chart.defaults.font.family = "'Inter', 'Helvetica', sans-serif"; 
    this.cargarEstadisticas();
  }

  ngAfterViewInit() {
  }

  formatearMonto(valor: any): string {
    const numero = Number(valor) || 0;
    return numero.toFixed(2);
  }

  cargarEstadisticas() {
    this.cargando = true;

    this.balanceService.obtenerEstadisticasGastos().subscribe({
      next: (estadisticas) => {
        this.totalGastos = estadisticas.total || 0;
        this.promedioGastos = estadisticas.promedio || 0;
        this.cantidadGastos = estadisticas.cantidad || 0;

        if (estadisticas.top5 && estadisticas.top5.length > 0) {
          this.gastoMayor = {
            monto: estadisticas.max || estadisticas.top5[0].monto,
            descripcion: estadisticas.top5[0].descripcion
          };
        } else {
          this.gastoMayor = null;
        }

        this.cargando = false;
        this.cdr.detectChanges();

        this.renderPieChart(estadisticas.graficoTags || []);
        this.renderLineChart(estadisticas.graficoMensual || []);
        this.renderBarChart(estadisticas.top5 || []);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de gastos:', err);
        this.cantidadGastos = 0;
        this.totalGastos = 0;
        this.promedioGastos = 0;
        this.gastoMayor = null;
        
        this.cargando = false;
        this.cdr.detectChanges();

        this.renderPieChartDummy();
        this.renderLineChartDummy();
        this.renderBarChartDummy();
      }
    });
  }

  renderPieChart(data: any) {
    if (!this.pieCanvas) return;
    
    if (this.chartPieInstance) this.chartPieInstance.destroy();

    this.chartPieInstance = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map((item: any) => item.tag || 'Sin categoría'),
        datasets: [{
          data: data.map((item: any) => item.total),
          backgroundColor: [
            '#ef4444', '#f97316', '#f59e0b', '#eab308',
            '#84cc16', '#22c55e', '#10b981', '#14b8a6'
          ],
          borderColor: 'transparent'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Gastos por Categoría' }
        }
      }
    });
  }

  renderPieChartDummy() {
    if (!this.pieCanvas) return;
    if (this.chartPieInstance) this.chartPieInstance.destroy();

    this.chartPieInstance = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Sin datos'],
        datasets: [{
          data: [1],
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#eab308'],
          borderColor: 'transparent'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Gastos por Categoría' }
        }
      }
    });
  }

  renderLineChart(data: any) {
    if (!this.lineCanvas) return;
    if (this.chartLineInstance) this.chartLineInstance.destroy();

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    this.chartLineInstance = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((item: any) => meses[item.mes - 1] || `Mes ${item.mes}`),
        datasets: [{
          label: 'Gastos Mensuales',
          data: data.map((item: any) => item.total),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolución Mensual' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderLineChartDummy() {
    if (!this.lineCanvas) return;
    if (this.chartLineInstance) this.chartLineInstance.destroy();

    this.chartLineInstance = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
        datasets: [{
          label: 'Gastos Mensuales',
          data: [1],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolución Mensual' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

renderBarChart(data: any) {
  if (!this.barCanvas) return;
  if (this.chartBarInstance) this.chartBarInstance.destroy();

  this.chartBarInstance = new Chart(this.barCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: data.map((item: any) => item.descripcion),
      datasets: [{
        label: 'Monto',
        data: data.map((item: any) => item.monto),
        backgroundColor: '#ef4444',
        borderRadius: 5 
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Top Gastos Más Altos' },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label; 
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true },
        x: {
          ticks: {
            maxRotation: 0, 
            minRotation: 0,
            callback: function(value, index, values) {
              const label = this.getLabelForValue(value as number);
              if (label.length > 15) {
                return label.substr(0, 15) + '...';
              }
              return label;
            }
          }
        }
      }
    }
  });
}

  renderBarChartDummy() {
    if (!this.barCanvas) return;
    if (this.chartBarInstance) this.chartBarInstance.destroy();

    this.chartBarInstance = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['sin datos'],
        datasets: [{
          label: 'Monto',
          data: [0],
          backgroundColor: '#ef4444'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Gastos Más Altos' }
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