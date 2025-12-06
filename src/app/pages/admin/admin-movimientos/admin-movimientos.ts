import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-admin-movimientos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AdminNavbarComponent, 
    Footer, 
    MatSidenavModule, 
    MatListModule, 
    MatIconModule, 
    MatDividerModule, 
    MatCardModule
  ],
  templateUrl: './admin-movimientos.html',
})
export class AdminMovimientos implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  movimientosOriginales: any[] = [];
  movimientosVisibles: any[] = [];
  
  loading = true;
  
  filtroTipo: string = 'todos'; 
  terminoBusqueda: string = '';

  ngOnInit() {
    this.cargarTodosLosMovimientos();
  }

  cargarTodosLosMovimientos() {
    this.loading = true;

    forkJoin({
      gastos: this.http.get<any[]>(`${this.apiUrl}/movimientos/gastos`),
      ingresos: this.http.get<any[]>(`${this.apiUrl}/movimientos/ingresos`),
      prestamos: this.http.get<any[]>(`${this.apiUrl}/prestamos`)
    }).pipe(
      map(res => {
        const listaGastos = Array.isArray(res.gastos) ? res.gastos : (res.gastos as any).data || [];
        const listaIngresos = Array.isArray(res.ingresos) ? res.ingresos : (res.ingresos as any).data || [];
        const listaPrestamos = Array.isArray(res.prestamos) ? res.prestamos : (res.prestamos as any).data || [];

        return [
          ...listaGastos.map((g: any) => ({ ...g, tipo: 'gasto', fecha_ref: g.fecha, usuario_ref: g.usuario })),
          ...listaIngresos.map((i: any) => ({ ...i, tipo: 'ingreso', fecha_ref: i.fecha, usuario_ref: i.usuario })),
          ...listaPrestamos.map((p: any) => ({ 
              ...p, 
              tipo: 'prestamo', 
              descripcion: `Préstamo: ${p.prestamista || 'Sistema'}`, 
              monto: p.monto_total,
              fecha_ref: p.fecha_creacion || p.fecha_limite, 
              usuario_ref: p.usuario
          }))
        ];
      })
    ).subscribe({
      next: (todos) => {
        const ordenados = todos.sort((a, b) => 
            new Date(b.fecha_ref).getTime() - new Date(a.fecha_ref).getTime()
        );

        this.movimientosOriginales = ordenados;
        this.movimientosVisibles = ordenados;
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando movimientos:', err);
        this.loading = false;
      }
    });
  }
  
  aplicarFiltros() {
    let datos = [...this.movimientosOriginales];

    if (this.filtroTipo !== 'todos') {
      datos = datos.filter(m => m.tipo === this.filtroTipo);
    }

    if (this.terminoBusqueda.trim() !== '') {
      const term = this.terminoBusqueda.toLowerCase();
      datos = datos.filter(m => 
        m.usuario_ref?.nombre_completo?.toLowerCase().includes(term) ||
        m.usuario_ref?.email?.toLowerCase().includes(term) ||
        m.descripcion?.toLowerCase().includes(term)
      );
    }

    this.movimientosVisibles = datos;
  }

  cambiarTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  // --- ELIMINAR (IGUAL QUE ANTES) ---
  eliminar(item: any) {
    if(!confirm(`¿Eliminar este registro de ${item.tipo}?`)) return;

    let endpoint = '';
    let id = 0;

    switch(item.tipo) {
        case 'gasto': endpoint = 'gastos'; id = item.id_movimiento; break;
        case 'ingreso': endpoint = 'ingresos'; id = item.id_movimiento; break;
        case 'prestamo': endpoint = 'prestamos'; id = item.id_prestamo; break;
    }

    this.http.delete(`${this.apiUrl}/${endpoint}/${id}`).subscribe({
        next: () => {
            this.movimientosOriginales = this.movimientosOriginales.filter(m => m !== item);
            this.aplicarFiltros(); 
            alert('Eliminado correctamente');
        },
        error: (e) => alert('Error al eliminar: ' + e.message)
    });
  }

  getBadgeColor(tipo: string): string {
      switch(tipo) {
          case 'ingreso': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'gasto': return 'bg-red-50 text-red-700 border-red-200';
          case 'prestamo': return 'bg-sky-100 text-sky-700 border-sky-200';
          default: return 'bg-gray-100 text-gray-600';
      }
  }

  getIcono(tipo: string): string {
      switch(tipo) {
          case 'ingreso': return '📈';
          case 'gasto': return '📉';
          case 'prestamo': return '💳';
          default: return '📄';
      }
  }
}