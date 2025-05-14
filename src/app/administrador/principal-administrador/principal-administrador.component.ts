import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AsideAdministradorComponent } from '../../componentes/aside-administrador/aside-administrador.component';
import { Estadisticas, StatsService } from '../../core/stats/stats.service';

@Component({
  selector: 'app-principal-administrador',
  standalone: true,
  imports: [CommonModule, AsideAdministradorComponent],
  templateUrl: './principal-administrador.component.html',
  styleUrls: ['./principal-administrador.component.css']
})
export class PrincipalAdministradorComponent implements AfterViewInit, OnDestroy {
  estadisticas!: Estadisticas;
  private charts: Chart[] = [];

  constructor(private statsService: StatsService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    // Limpiar las gráficas al destruir el componente
    this.charts.forEach(chart => chart.destroy());
  }

  private loadStats(): void {
    this.statsService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        // Aquí podrías agregar manejo de errores UI
      }
    });
  }

  private initializeCharts(): void {
    this.renderGeneralStatsChart();
  }

 private renderGeneralStatsChart(): void {
  const ctx = document.getElementById('generalStatsChart') as HTMLCanvasElement;
  if (!ctx) return;

  const chart = new Chart(ctx.getContext('2d')!, {
    type: 'bar',
    data: {
      labels: [
        'Escuelas', 
        'Facultades', 
        'Jefes de Carrera', 
        'Carreras',
        
      ],
      datasets: [{
        label: 'Estadísticas Generales',
        data: [
          this.estadisticas.escuelas, 
          this.estadisticas.facultades, 
          this.estadisticas.jefes, 
          this.estadisticas.carreras,
    
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Azul
          'rgba(76, 175, 80, 0.8)',  // Verde
          'rgba(255, 152, 0, 0.8)',  // Naranja
          'rgba(244, 67, 54, 0.8)',  // Rojo
          'rgba(156, 39, 176, 0.8)', // Púrpura
          'rgba(0, 188, 212, 0.8)',  // Cian
          'rgba(255, 193, 7, 0.8)',  // Amarillo
          'rgba(0, 150, 136, 0.8)'   // Verde oscuro
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Estadísticas Generales',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });

  this.charts.push(chart);
}


 
}