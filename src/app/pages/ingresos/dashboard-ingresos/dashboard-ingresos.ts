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

    // Cargar todas las estadísticas en una sola llamada
    this.balanceService.obtenerEstadisticasIngresos().subscribe({
      next: (estadisticas) => {
        // Asignar los datos iniciales
        this.totalIngresos = estadisticas.total || 0;
        this.promedioIngresos = estadisticas.promedio || 0;
        this.cantidadIngresos = estadisticas.cantidad || 0;

        // Encontrar el ingreso mayor del top5
        if (estadisticas.top5 && estadisticas.top5.length > 0) {
          this.ingresoMayor = {
            monto: estadisticas.max || estadisticas.top5[0].monto,
            descripcion: estadisticas.top5[0].descripcion
          };
        } else {
          this.ingresoMayor = null;
        }

        this.cargando = false;

        // Renderizar las gráficas con los datos del backend
        this.renderPieChart(estadisticas.graficoTags || []);
        this.renderLineChart(estadisticas.graficoMensual || []);
        this.renderBarChart(estadisticas.top5 || []);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de ingresos:', err);
        // Inicializar con valores por defecto y mostrar datos dummy
        this.cantidadIngresos = 0;
        this.totalIngresos = 0;
        this.promedioIngresos = 0;
        this.ingresoMayor = null;
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

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((item: any) => meses[item.mes - 1] || `Mes ${item.mes}`),
        datasets: [{
          label: 'Ingresos Mensuales',
          data: data.map((item: any) => item.total),
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
          title: { display: true, text: 'Evolución de Ingresos (Últimos meses)' }
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
