import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AsideAdministradorComponent } from "../../componentes/aside-administrador/aside-administrador.component";

@Component({
  selector: 'app-principal-administrador',
  standalone: true,
  imports: [AsideAdministradorComponent],
  templateUrl: './principal-administrador.component.html',
  styleUrl: './principal-administrador.component.css'
})
export class PrincipalAdministradorComponent implements AfterViewInit {

  constructor() {
    Chart.register(...registerables); // Registra los componentes necesarios de Chart.js
  }

  ngAfterViewInit(): void {
    this.renderSchoolsChart();
    this.renderCareersChart();
  }

  renderSchoolsChart(): void {
    const ctx = document.getElementById('schoolsChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Públicas', 'Privadas', 'Técnicas', 'Virtuales'],
        datasets: [{
          data: [14, 6, 3, 1],
          backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  renderCareersChart(): void {
    const ctx = document.getElementById('careersChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Ingeniería', 'Ciencias', 'Humanidades', 'Artes', 'Salud', 'Negocios'],
        datasets: [{
          label: 'Número de Carreras',
          data: [42, 31, 24, 15, 18, 26],
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
