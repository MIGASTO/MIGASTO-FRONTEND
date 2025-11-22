import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  // Variables para guardar las instancias de las gráficas y poder destruirlas al recargar
  private chartPieInstance: Chart | null = null;
  private chartLineInstance: Chart | null = null;
  private chartBarInstance: Chart | null = null;

  totalIngresos = 0;
  promedioIngresos = 0;
  ingresoMayor: any = null;
  cantidadIngresos = 0;
  cargando = true;

  constructor(
    private balanceService: BalanceService,
    private ingresosService: IngresosService,
    private router: Router,
    private cdr: ChangeDetectorRef // <--- Inyección necesaria para corregir el error de carga
  ) {}

  ngOnInit() {
    Chart.defaults.color = '#f1f5f9'; // Slate-100 (Blanco grisáceo)
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)'; // Líneas muy sutiles
    Chart.defaults.font.family = "'Inter', 'Helvetica', sans-serif"; // Fuente limpia
    
    this.cargarEstadisticas();
  }

  ngAfterViewInit() {
    // Ya no dependemos de esto porque forzamos la detección en cargarEstadisticas
  }

  formatearMonto(valor: any): string {
    const numero = Number(valor) || 0;
    return numero.toFixed(2);
  }

  cargarEstadisticas() {
    this.cargando = true;

    this.balanceService.obtenerEstadisticasIngresos().subscribe({
      next: (estadisticas) => {
        this.totalIngresos = estadisticas.total || 0;
        this.promedioIngresos = estadisticas.promedio || 0;
        this.cantidadIngresos = estadisticas.cantidad || 0;

        if (estadisticas.top5 && estadisticas.top5.length > 0) {
          this.ingresoMayor = {
            monto: estadisticas.max || estadisticas.top5[0].monto,
            descripcion: estadisticas.top5[0].descripcion
          };
        } else {
          this.ingresoMayor = null;
        }

        // 1. Finalizamos la carga lógica
        this.cargando = false;

        // 2. IMPORTANTE: Forzar actualización del HTML para que los <canvas> existan
        this.cdr.detectChanges();

        // 3. Renderizar gráficas
        this.renderPieChart(estadisticas.graficoTags || []);
        this.renderLineChart(estadisticas.graficoMensual || []);
        this.renderBarChart(estadisticas.top5 || []);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de ingresos:', err);
        
        this.cantidadIngresos = 0;
        this.totalIngresos = 0;
        this.promedioIngresos = 0;
        this.ingresoMayor = null;
        
        this.cargando = false;
        
        // También forzamos actualización en caso de error
        this.cdr.detectChanges();

        this.renderPieChartDummy();
        this.renderLineChartDummy();
        this.renderBarChartDummy();
      }
    });
  }

  renderPieChart(data: any) {
    if (!this.pieCanvas) return;
    // Destruir gráfica anterior si existe
    if (this.chartPieInstance) this.chartPieInstance.destroy();

    this.chartPieInstance = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map((item: any) => item.tag || 'Sin categoría'),
        datasets: [{
          data: data.map((item: any) => item.total),
          backgroundColor: [
            '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
            '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'
          ],
          borderColor: 'transparent'
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
    if (this.chartPieInstance) this.chartPieInstance.destroy();

    this.chartPieInstance = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
        datasets: [{
          data: [2000, 500, 300, 200],
          backgroundColor: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'],
          borderColor: 'transparent'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Ingresos por Categoría (Ejemplo)' }
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
          title: { display: true, text: 'Evolución de Ingresos' }
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
        labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
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
          title: { display: true, text: 'Evolución (Ejemplo)' }
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
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Ingresos Más Altos' }
        },
        scales: {
          y: { beginAtZero: true }
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
        labels: ['Salario', 'Freelance', 'Dividendos', 'Venta', 'Bono'],
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
          title: { display: true, text: 'Top Ingresos (Ejemplo)' }
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