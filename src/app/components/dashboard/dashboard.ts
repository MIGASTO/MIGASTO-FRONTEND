import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.renderPieChart();
    this.renderBarChart();
  }

  renderPieChart() {
    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Gastos', 'Ingresos'],
        datasets: [{
          data: [350, 650],
          backgroundColor: ['#f87171', '#34d399']
        }]
      },
      options: { responsive: true }
    });
  }

  renderBarChart() {
    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [
          { label: 'Gastos', data: [300, 400, 350, 500], backgroundColor: '#f87171' },
          { label: 'Ingresos', data: [700, 650, 800, 900], backgroundColor: '#34d399' }
        ]
      },
      options: { responsive: true }
    });
  }
}
