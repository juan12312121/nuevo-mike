import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.css']
})
export class Tab2Component implements OnChanges {
  @Input() resumen!: {
    turno: string;
    horario: string;
    tipoDuracion: string;
    duracionClases: number;
    grupo: string;
    aula: string;
    dias: string[];
  };

  @Input() currentTab: 'formato' | 'dias' | 'diseno' = 'formato';
  @Output() tabChange = new EventEmitter<'formato' | 'dias' | 'diseno'>();

  @Input() diasSeleccionados: string[] = [];
  @Output() diasSeleccionadosChange = new EventEmitter<string[]>();

  @Input() diasSemana: string[] = [];

  // Historial local de estados
  private estadoHistorial: Array<{
    resumen: any;
    diasSeleccionados: string[];
    timestamp: string;
  }> = [];

  constructor() {
    // Cargar historial previo de localStorage
    const saved = localStorage.getItem('tab2Estados');
    if (saved) {
      try {
        this.estadoHistorial = JSON.parse(saved);
      } catch {
        this.estadoHistorial = [];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diasSeleccionados']) {
      console.log('📌 Cambio en días seleccionados:', this.diasSeleccionados);
    }
    if (changes['diasSemana'] && this.diasSemana.length) {
      console.log('📌 Días de la semana recibidos:', this.diasSemana);
    }
  }

  navegarTab(direccion: 'anterior' | 'siguiente'): void {
    // Si navegamos hacia siguiente, guardamos estado
    if (direccion === 'siguiente') {
      this.guardarEstado();
    }

    const siguiente =
      direccion === 'anterior'
        ? this.currentTab === 'dias' ? 'formato' : 'dias'
        : this.currentTab === 'formato' ? 'dias' : 'diseno';

    this.tabChange.emit(siguiente as any);
  }

  onCheckboxChange(dia: string, checked: boolean): void {
    if (checked) {
      this.diasSeleccionados = [...this.diasSeleccionados, dia];
    } else {
      this.diasSeleccionados = this.diasSeleccionados.filter(d => d !== dia);
    }

    this.diasSeleccionadosChange.emit(this.diasSeleccionados);
  }

  /**
   * Guarda el estado actual (resumen + días seleccionados) en memoria y localStorage
   */
  private guardarEstado(): void {
    const estadoActual = {
      resumen: { ...this.resumen },
      diasSeleccionados: [...this.diasSeleccionados],
      timestamp: new Date().toISOString()
    };
    this.estadoHistorial.push(estadoActual);
    localStorage.setItem('tab2Estados', JSON.stringify(this.estadoHistorial));
    console.log('🔖 Estado guardado:', estadoActual);
  }
}
