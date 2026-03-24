import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AsideAdministradorComponent } from '../../administrador/aside-administrador/aside-administrador.component';
import { Estadisticas, StatsService } from '../../core/stats/stats.service';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { EscuelasService, Escuela } from '../../core/escuelas/escuelas.service';

@Component({
  selector: 'app-principal-super-admin',
  standalone: true,
  imports: [CommonModule, AsideAdministradorComponent],
  templateUrl: './principal-super-admin.component.html',
  styleUrls: ['./principal-super-admin.component.css']
})
export class PrincipalSuperAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  estadisticas!: Estadisticas;
  escuelas: Escuela[] = [];
  private charts: Chart[] = [];

  constructor(
    private statsService: StatsService,
    private escuelasService: EscuelasService,
    public usuariosService: UsuariosService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarEscuelas();
  }

  ngAfterViewInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private cargarEscuelas(): void {
    this.escuelasService.verEscuelas().subscribe({
      next: (res) => this.escuelas = res.escuelas,
      error: (err) => console.error('Error al cargar escuelas', err)
    });
  }

  private loadStats(): void {
    this.statsService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.initializeCharts();
      },
      error: (error) => console.error('Error al cargar estadísticas:', error)
    });
  }

  private initializeCharts(): void {
    this.renderGeneralStatsChart();
  }

  private renderGeneralStatsChart(): void {
    const ctx = document.getElementById('globalStatsChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chart = new Chart(ctx.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Facultades', 'Jefes de Carrera', 'Carreras'],
        datasets: [{
          data: [
            this.estadisticas.facultades,
            this.estadisticas.jefes,
            this.estadisticas.carreras
          ],
          backgroundColor: [
            '#3182ce',
            '#38a169',
            '#e53e3e'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    this.charts.push(chart);
  }
}
