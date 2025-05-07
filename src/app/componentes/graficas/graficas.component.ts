import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

type Estado = 'Asistió' | 'No Asistió' | 'Justificado';
interface ProfesorStats {
  Asistió: number;
  'No Asistió': number;
  Justificado: number;
  total: number;
}

@Component({
  selector: 'app-dashboard-graficas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class DashboardGraficasComponent implements AfterViewInit, OnChanges {
  /** Ahora sí podemos enlazar desde el padre */
  @Input() asistencias: any[] = [];

  public dataReady = false;
  private initialized = false;
  private charts: Record<string, Chart> = {};

  @ViewChild('statusChart', { static: false }) statusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('weekdayChart', { static: false }) weekdayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bestTeachersChart', { static: false }) bestTeachersCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('worstTeachersChart', { static: false }) worstTeachersCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('registrationTypeChart', { static: false }) registrationTypeCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asistencias']) {
      this.dataReady = Array.isArray(this.asistencias) && this.asistencias.length > 0;
      
      // Si ya se inicializaron los elementos del DOM y hay datos,
      // intentamos crear o actualizar los gráficos
      if (this.initialized && this.dataReady) {
        this.destroyCharts();
        setTimeout(() => this.initCharts(), 0);
      }
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    
    // Verificamos que haya datos y que los ViewChildren estén disponibles
    if (this.dataReady) {
      // Usamos setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => this.initCharts(), 0);
    }
  }

  /** Destruye todos los charts existentes */
  private destroyCharts(): void {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy();
        delete this.charts[key];
      }
    });
  }

  /** Crea todos los charts */
  private initCharts(): void {
    // Verificar que todos los canvas están disponibles antes de intentar crear los gráficos
    if (!this.canvasesAreReady()) {
      console.log('Canvas elements not ready yet. Trying again later...');
      setTimeout(() => this.initCharts(), 100);
      return;
    }

    try {
      this.createStatusChart();
      this.createWeekdayChart();
      this.createRegistrationTypeChart();
    } catch (error) {
      console.error('Error creating charts:', error);
    }
  }

  /** Verifica que todos los elementos canvas estén disponibles */
  private canvasesAreReady(): boolean {
    return Boolean(
      this.statusCanvas?.nativeElement &&
      this.weekdayCanvas?.nativeElement &&
      this.bestTeachersCanvas?.nativeElement &&
      this.worstTeachersCanvas?.nativeElement &&
      this.registrationTypeCanvas?.nativeElement
    );
  }

  private createStatusChart(): void {
    if (!this.statusCanvas) return;
    
    const estados: Record<Estado, number> = { Asistió: 0, 'No Asistió': 0, Justificado: 0 };
    this.asistencias.forEach(a => {
      const e = a.asistio as Estado;
      if (e in estados) estados[e]++;
    });
    
    this.charts['status'] = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(estados),
        datasets: [{ 
          data: Object.values(estados), 
          borderWidth: 1,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribución de Asistencias' }
        }
      }
    });
  }

  private createWeekdayChart(): void {
    if (!this.weekdayCanvas) return;
    
    const dias: Record<string, Record<Estado, number>> = {
      Lunes:     { Asistió: 0, 'No Asistió': 0, Justificado: 0 },
      Martes:    { Asistió: 0, 'No Asistió': 0, Justificado: 0 },
      Miércoles: { Asistió: 0, 'No Asistió': 0, Justificado: 0 },
      Jueves:    { Asistió: 0, 'No Asistió': 0, Justificado: 0 },
      Viernes:   { Asistió: 0, 'No Asistió': 0, Justificado: 0 }
    };
    this.asistencias.forEach(a => {
      const d = a.dia_semana;
      const e = a.asistio as Estado;
      if (dias[d] && e in dias[d]) dias[d][e]++;
    });
    
    this.charts['weekday'] = new Chart(this.weekdayCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(dias),
        datasets: [
          { 
            label: 'Asistió',
            data: Object.values(dias).map(x => x.Asistió),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1 
          },
          { 
            label: 'No Asistió',
            data: Object.values(dias).map(x => x['No Asistió']),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1 
          },
          { 
            label: 'Justificado',
            data: Object.values(dias).map(x => x.Justificado),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1 
          }
        ]
      },
      options: {
        responsive: true,
        scales: { 
          x: { stacked: true }, 
          y: { stacked: true, beginAtZero: true } 
        },
        plugins: {
          title: { display: true, text: 'Asistencias por Día de la Semana' },
          legend: { position: 'bottom' }
        }
      }
    });
  }



  private createRegistrationTypeChart(): void {
    if (!this.registrationTypeCanvas) return;
    
    const tipos: Record<string, number> = {};
    this.asistencias.forEach(a => {
      const t = a.tipo_registro as string;
      tipos[t] = (tipos[t] || 0) + 1;
    });
    
    this.charts['registrationType'] = new Chart(this.registrationTypeCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Object.keys(tipos),
        datasets: [{ 
          data: Object.values(tipos), 
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderWidth: 1 
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Registros por Tipo de Usuario' }
        }
      }
    });
  }
}