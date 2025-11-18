import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Navbar } from '../../../components/navbar/navbar';
import { BalanceService } from '../../../services/balance.service';
import { GastosService } from '../../../services/gasto.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-gastos',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './dashboard-gastos.html',
  styleUrls: ['./dashboard-gastos.css']
})
export class DashboardGastos implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  totalGastos = 0;
  promedioGastos = 0;
  gastoMayor: any = null;
  cantidadGastos = 0;
  cargando = true;

  constructor(
    private balanceService: BalanceService,
    private gastosService: GastosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ngAfterViewInit() {
    // Las gráficas se renderizan después de cargar los datos
  }

  cargarEstadisticas() {
    this.cargando = true;

    // Cargar todos los gastos para calcular estadísticas básicas
    this.gastosService.obtenerGasto().subscribe({
      next: (gastos) => {
        this.cantidadGastos = gastos.length;
        this.totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
        this.promedioGastos = this.cantidadGastos > 0 ? this.totalGastos / this.cantidadGastos : 0;
        this.gastoMayor = gastos.reduce((max, g) => g.monto > (max?.monto || 0) ? g : max, null);

        this.cargando = false;
        this.renderizarGraficas();
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de gastos:', err);
        this.cargando = false;
      }
    });
  }

  renderizarGraficas() {
    // Gráfica de distribución por categoría (pie)
    this.balanceService.obtenerGastosPorCategoria().subscribe({
      next: (data) => this.renderPieChart(data),
      error: (err) => {
        console.error('Error al cargar gastos por categoría:', err);
        this.renderPieChartDummy();
      }
    });

    // Gráfica de evolución mensual (line)
    this.balanceService.obtenerEvolucionMensual().subscribe({
      next: (data) => this.renderLineChart(data),
      error: (err) => {
        console.error('Error al cargar evolución mensual:', err);
        this.renderLineChartDummy();
      }
    });

    // Gráfica de top gastos (bar)
    this.balanceService.obtenerTopGastos(10).subscribe({
      next: (data) => this.renderBarChart(data),
      error: (err) => {
        console.error('Error al cargar top gastos:', err);
        this.renderBarChartDummy();
      }
    });
  }

  renderPieChart(data: any) {
    if (!this.pieCanvas) return;

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map((item: any) => item.categoria || 'Sin categoría'),
        datasets: [{
          data: data.map((item: any) => item.total),
          backgroundColor: [
            '#ef4444', '#f97316', '#f59e0b', '#eab308',
            '#84cc16', '#22c55e', '#10b981', '#14b8a6'
          ]
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

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Comida', 'Transporte', 'Entretenimiento', 'Otros'],
        datasets: [{
          data: [400, 300, 200, 100],
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#eab308']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Gastos por Categoría (Datos de ejemplo)' }
        }
      }
    });
  }

  renderLineChart(data: any) {
    if (!this.lineCanvas) return;

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((item: any) => item.mes),
        datasets: [{
          label: 'Gastos Mensuales',
          data: data.map((item: any) => item.gastos),
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
          title: { display: true, text: 'Evolución de Gastos (Últimos 6 meses)' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderLineChartDummy() {
    if (!this.lineCanvas) return;

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
        datasets: [{
          label: 'Gastos Mensuales',
          data: [1200, 1500, 1100, 1400, 1300, 1600],
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
          title: { display: true, text: 'Evolución de Gastos (Datos de ejemplo)' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderBarChart(data: any) {
    if (!this.barCanvas) return;

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((item: any) => item.descripcion),
        datasets: [{
          label: 'Monto',
          data: data.map((item: any) => item.monto),
          backgroundColor: '#ef4444'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top 10 Gastos Más Altos' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  renderBarChartDummy() {
    if (!this.barCanvas) return;

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Mercado', 'Gasolina', 'Restaurante', 'Cine', 'Farmacia'],
        datasets: [{
          label: 'Monto',
          data: [350, 300, 250, 150, 100],
          backgroundColor: '#ef4444'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Gastos Más Altos (Datos de ejemplo)' }
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
