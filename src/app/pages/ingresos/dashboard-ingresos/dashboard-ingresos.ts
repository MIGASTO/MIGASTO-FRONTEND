import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Navbar } from '../../../components/navbar/navbar';
import { BalanceService } from '../../../services/balance.service';
import { IngresosService } from '../../../services/ingreso.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-ingresos',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './dashboard-ingresos.html',
  styleUrls: ['./dashboard-ingresos.css']
})
export class DashboardIngresos implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  totalIngresos = 0;
  promedioIngresos = 0;
  ingresoMayor: any = null;
  cantidadIngresos = 0;
  cargando = true;

  constructor(
    private balanceService: BalanceService,
    private ingresosService: IngresosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ngAfterViewInit() {
    // Las gráficas se renderizan después de cargar los datos
  }

  formatearMonto(valor: any): string {
    const numero = Number(valor) || 0;
    return numero.toFixed(2);
  }

  cargarEstadisticas() {
    this.cargando = true;

    // Cargar todos los ingresos para calcular estadísticas básicas
    this.ingresosService.obtenerIngresos().subscribe({
      next: (ingresos) => {
        this.cantidadIngresos = ingresos.length || 0;
        this.totalIngresos = ingresos.reduce((sum: number, i: any) => sum + (Number(i.monto) || 0), 0);
        this.promedioIngresos = this.cantidadIngresos > 0 ? this.totalIngresos / this.cantidadIngresos : 0;
        this.ingresoMayor = ingresos.reduce((max: any, i: any) => (Number(i.monto) || 0) > (Number(max?.monto) || 0) ? i : max, null);

        this.cargando = false;
        this.renderizarGraficas();
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de ingresos:', err);
        // Inicializar con valores por defecto en caso de error
        this.cantidadIngresos = 0;
        this.totalIngresos = 0;
        this.promedioIngresos = 0;
        this.ingresoMayor = null;
        this.cargando = false;
        this.renderizarGraficas();
      }
    });
  }

  renderizarGraficas() {
    // Gráfica de distribución por categoría (pie)
    this.balanceService.obtenerIngresosPorCategoria().subscribe({
      next: (data) => this.renderPieChart(data),
      error: (err) => {
        console.error('Error al cargar ingresos por categoría:', err);
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

    // Gráfica de top ingresos (bar)
    this.balanceService.obtenerTopIngresos(10).subscribe({
      next: (data) => this.renderBarChart(data),
      error: (err) => {
        console.error('Error al cargar top ingresos:', err);
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
            '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
            '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Ingresos por Categoría' }
        }
      }
    });
  }

  renderPieChartDummy() {
    if (!this.pieCanvas) return;

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
        datasets: [{
          data: [2000, 500, 300, 200],
          backgroundColor: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Ingresos por Categoría (Datos de ejemplo)' }
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
          label: 'Ingresos Mensuales',
          data: data.map((item: any) => item.ingresos),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolución de Ingresos (Últimos 6 meses)' }
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
          label: 'Ingresos Mensuales',
          data: [3000, 3200, 2900, 3100, 3300, 3500],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Evolución de Ingresos (Datos de ejemplo)' }
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
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top 10 Ingresos Más Altos' }
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
        labels: ['Salario Mensual', 'Proyecto Freelance', 'Dividendos', 'Venta', 'Bono'],
        datasets: [{
          label: 'Monto',
          data: [2000, 800, 300, 250, 150],
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Ingresos Más Altos (Datos de ejemplo)' }
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
