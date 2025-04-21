import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AsideJefecarreraComponent } from '../../componentes/aside-jefecarrera/aside-jefecarrera.component';

@Component({
  selector: 'app-registro-asistencia',
  standalone: true,
  imports: [AsideJefecarreraComponent],
  templateUrl: './registro-asistencia.component.html',
  styleUrls: ['./registro-asistencia.component.css']
})
export class RegistroAsistenciaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    Chart.register(...registerables);

    // Gráfico de asistencias por turno
    const attendanceByShiftCtx = document.getElementById('attendanceByShift') as HTMLCanvasElement;
    if (attendanceByShiftCtx) {
      new Chart(attendanceByShiftCtx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          datasets: [
            {
              label: 'Matutino',
              data: [45, 42, 48, 38, 36],
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            },
            {
              label: 'Vespertino',
              data: [32, 28, 34, 30, 26],
              backgroundColor: 'rgba(14, 165, 233, 0.7)',
              borderColor: 'rgba(14, 165, 233, 1)',
              borderWidth: 1
            },
            {
              label: 'Nocturno',
              data: [18, 16, 20, 14, 15],
              backgroundColor: 'rgba(79, 70, 229, 0.7)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Número de Asistencias' }
            },
            x: {
              title: { display: true, text: 'Día de la Semana' }
            }
          }
        }
      });
    }

    // Gráfico de materias con más faltas
    const topAbsenceSubjectsCtx = document.getElementById('topAbsenceSubjects') as HTMLCanvasElement;
    if (topAbsenceSubjectsCtx) {
      new Chart(topAbsenceSubjectsCtx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: [
            'Cálculo Diferencial',
            'Física I',
            'Programación Estructurada',
            'Álgebra Lineal',
            'Estructura de Datos'
          ],
          datasets: [
            {
              label: 'Número de Faltas',
              data: [8, 6, 5, 5, 4],
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: 'rgba(239, 68, 68, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: 'Número de Faltas' }
            }
          }
        }
      });
    }

    // Gráfico de tipo de registro
    const registrationTypeCtx = document.getElementById('registrationTypeChart') as HTMLCanvasElement;
    if (registrationTypeCtx) {
      new Chart(registrationTypeCtx.getContext('2d')!, {
        type: 'doughnut',
        data: {
          labels: ['Checador', 'Profesor', 'Jefe de Grupo'],
          datasets: [
            {
              data: [42, 35, 23],
              backgroundColor: [
                'rgba(14, 165, 233, 0.7)',
                'rgba(79, 70, 229, 0.7)',
                'rgba(139, 92, 246, 0.7)'
              ],
              borderColor: [
                'rgba(14, 165, 233, 1)',
                'rgba(79, 70, 229, 1)',
                'rgba(139, 92, 246, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }
}
