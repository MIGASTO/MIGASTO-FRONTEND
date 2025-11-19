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

  formatearMonto(valor: any): string {
    const numero = Number(valor) || 0;
    return numero.toFixed(2);
  }

  cargarEstadisticas() {
    this.cargando = true;

    // Cargar todas las estadísticas en una sola llamada
    this.balanceService.obtenerEstadisticasGastos().subscribe({
      next: (estadisticas) => {
        // Asignar los datos iniciales
        this.totalGastos = estadisticas.total || 0;
        this.promedioGastos = estadisticas.promedio || 0;
        this.cantidadGastos = estadisticas.cantidad || 0;

        // Encontrar el gasto mayor del top5
        if (estadisticas.top5 && estadisticas.top5.length > 0) {
          this.gastoMayor = {
            monto: estadisticas.max || estadisticas.top5[0].monto,
            descripcion: estadisticas.top5[0].descripcion
          };
        } else {
          this.gastoMayor = null;
        }

        this.cargando = false;

        // Renderizar las gráficas con los datos del backend
        this.renderPieChart(estadisticas.graficoTags || []);
        this.renderLineChart(estadisticas.graficoMensual || []);
        this.renderBarChart(estadisticas.top5 || []);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de gastos:', err);
        // Inicializar con valores por defecto y mostrar datos dummy
        this.cantidadGastos = 0;
        this.totalGastos = 0;
        this.promedioGastos = 0;
        this.gastoMayor = null;
        this.cargando = false;

        // Renderizar gráficas dummy
        this.renderPieChartDummy();
        this.renderLineChartDummy();
        this.renderBarChartDummy();
      }
    });
  }

  renderPieChart(data: any) {
    if (!this.pieCanvas) return;

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map((item: any) => item.tag || 'Sin categoría'),
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

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    new Chart(this.lineCanvas.nativeElement, {
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
          title: { display: true, text: 'Evolución de Gastos (Últimos meses)' }
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
