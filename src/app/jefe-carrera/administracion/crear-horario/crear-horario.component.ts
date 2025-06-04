import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { Tab2Component } from '../../../componentes/tab2/tab2.component';
import { Tab3Component } from '../../../componentes/tab3/tab3.component';

import { AulasService } from '../../../core/aulas/aulas.service';
import { GruposService } from '../../../core/grupos/grupos.service';
import { HorariosService } from '../../../core/horarios/horarios.service';

type TabKey = 'formato' | 'dias' | 'diseno';

@Component({
  selector: 'app-crear-horario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideJefecarreraComponent,
    Tab2Component,
    Tab3Component
  ],
  templateUrl: './crear-horario.component.html',
  styleUrls: ['./crear-horario.component.css']
})
export class CrearHorarioComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // --- UI State ---
  tabs: TabKey[] = ['formato', 'dias', 'diseno'];
  currentTab: TabKey = 'formato';

  // --- API Data ---
  aulas: any[] = [];
  grupos: any[] = [];
  turnos: string[] = [];
  diasSemana: string[] = [];
  tiposDuracion: string[] = [];
  diasSeleccionados: string[] = [];

  // --- Form Model ---
  selectedTurno: string | null = null;
  grupoSeleccionado: number | null = null;
  aulaSeleccionada: number | null = null;  // Cambiado a number
  minutosPorClase: number = 50;
  horaInicio: string = '';
  horaFin: string = '';
  showCustomSchedule = false;

  // --- Horas generadas para vista previa ---
  horasGeneradas: { horaInicio: string; horaFin: string; duracion: number }[] = [];

  // --- Resumen ---
  resumen: {
    turno: string;
    horario: string;
    tipoDuracion: string;
    duracionClases: number;
    grupo: string;
    grupoId: number | null;
    aula: string;
    aulaId: number | null;
    dias: string[];
  } = {
    turno: '',
    horario: '',
    tipoDuracion: '',
    duracionClases: 0,
    grupo: 'No seleccionado',
    grupoId: null,
    aula: 'No seleccionada',
    aulaId: null,
    dias: []
  };

  constructor(
    private aulasService: AulasService,
    private gruposService: GruposService,
    private horariosService: HorariosService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.loadCustomState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para obtener el tipo de una variable (para debug)
  getTypeOf(value: any): string {
    return typeof value;
  }

  // 1) Carga inicial de aulas, grupos y enums
  private loadInitialData() {
    forkJoin({
      aulas: this.aulasService.obtenerAulas(),
      grupos: this.gruposService.getGrupos(),
      enums: this.horariosService.getEnums()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ aulas, grupos, enums }) => {
          // Validar formato de aulas
          if (Array.isArray(aulas)) {
            this.aulas = aulas;
          } else if (Array.isArray((aulas as any).data)) {
            this.aulas = (aulas as any).data;
          } else if (Array.isArray((aulas as any).aulas)) {
            this.aulas = (aulas as any).aulas;
          } else {
            console.warn('[WARNING] Las aulas no tienen el formato esperado.');
            this.aulas = [];
          }

          // Validar formato de grupos
          if (Array.isArray(grupos)) {
            this.grupos = grupos;
          } else if (Array.isArray((grupos as any).data)) {
            this.grupos = (grupos as any).data;
          } else if (Array.isArray((grupos as any).grupos)) {
            this.grupos = (grupos as any).grupos;
          } else {
            console.warn('[WARNING] Los grupos no tienen el formato esperado.');
            this.grupos = [];
          }

          // Validar enums: turnos, días y tiposDuracion
          if (enums && Array.isArray(enums.turnos)) {
            this.turnos = enums.turnos;
          } else {
            console.warn('[WARNING] Los turnos no están definidos correctamente.');
            this.turnos = [];
          }

          if (enums && Array.isArray(enums.diasSemana)) {
            this.diasSemana = enums.diasSemana;
          } else {
            console.warn('[WARNING] Los días de la semana no están definidos correctamente.');
            this.diasSemana = [];
          }

          if (enums && Array.isArray(enums.tiposDuracion)) {
            this.tiposDuracion = enums.tiposDuracion;
          } else {
            console.warn('[WARNING] Los tipos de duración no están definidos correctamente.');
            this.tiposDuracion = [];
          }

          console.log('Datos cargados:', {
            aulas: this.aulas,
            grupos: this.grupos,
            turnos: this.turnos,
            diasSemana: this.diasSemana
          });
        },
        error: (err) => {
          console.error('[ERROR] loadInitialData:', err);
          alert('Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
      });
  }

  // 2) Cargar estado guardado en localStorage
  private loadCustomState() {
    const h = localStorage.getItem('horasPersonalizadas');
    this.horasGeneradas = h ? JSON.parse(h) : [];

    const form = localStorage.getItem('crearHorarioForm');
    if (form) {
      const s = JSON.parse(form);
      this.selectedTurno = s.selectedTurno;
      this.minutosPorClase = s.minutosPorClase;
      this.horaInicio = s.horaInicio;
      this.horaFin = s.horaFin;
      // Asegurar que se carguen como números
      this.grupoSeleccionado = s.grupoSeleccionado ? Number(s.grupoSeleccionado) : null;
      this.aulaSeleccionada = s.aulaSeleccionada ? Number(s.aulaSeleccionada) : null;
      this.horasGeneradas = s.horasGeneradas || [];
      this.showCustomSchedule = (this.selectedTurno === 'Personalizado');
    }
  }

  private saveCustomHours() {
    localStorage.setItem('horasPersonalizadas', JSON.stringify(this.horasGeneradas));
  }

  private saveFormState() {
    const state = {
      selectedTurno: this.selectedTurno,
      minutosPorClase: this.minutosPorClase,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      grupoSeleccionado: this.grupoSeleccionado,
      aulaSeleccionada: this.aulaSeleccionada,
      horasGeneradas: this.horasGeneradas
    };
    localStorage.setItem('crearHorarioForm', JSON.stringify(state));
    console.log('Estado guardado:', state);
  }

  // 3) Navegación entre tabs
  selectTab(tab: TabKey) {
    if (!this.tabs.includes(tab)) return;

    if (tab === 'dias') {
      this.updateResumen();
    }
    this.currentTab = tab;
  }

  nextTab() {
    // Antes de pasar a "dias", guardamos el estado del formato
    this.saveFormState();
    this.selectTab('dias');
  }

  // 4) Lógica de turno
  onTurnoChange() {
    if (!this.selectedTurno) return;

    if (this.selectedTurno === 'Personalizado') {
      this.showCustomSchedule = true;
      this.horasGeneradas = [];
    } else {
      this.showCustomSchedule = false;
      this.generateScheduleByDuration();
    }
    this.saveFormState();
  }

  private generateScheduleByDuration() {
    const info = this.getInfoTurno();
    if (!info || !info.horario) {
      console.error('Turno no válido o sin horario definido.');
      return;
    }

    // Extraer horas
    const [hi, hf] = info.horario.split(' a ');
    const startMinutes = this.timeToMinutes(hi);
    const endMinutes = this.timeToMinutes(hf);

    // Validar duración
    if (this.minutosPorClase < 50 || this.minutosPorClase > 60) {
      console.warn('Duración de clase inválida:', this.minutosPorClase);
      return;
    }

    // Generar bloques
    const slots: { horaInicio: string; horaFin: string; duracion: number }[] = [];
    let cursor = startMinutes;
    while (cursor + this.minutosPorClase <= endMinutes) {
      const next = cursor + this.minutosPorClase;
      slots.push({
        horaInicio: this.minutesToTime(cursor),
        horaFin: this.minutesToTime(next),
        duracion: this.minutosPorClase
      });
      cursor = next;
    }

    this.horasGeneradas = slots;
  }

  generateCustomSchedule() {
    // Cuando el usuario está en "Personalizado" y pulsó "Generar Horario"
    this.generateScheduleByDuration();
    this.saveCustomHours();
  }

  getInfoTurno() {
    const turnosData: { [key: string]: { horario: string; descripcion: string } } = {
      Matutino: { horario: '07:00 a 13:00', descripcion: 'Turno de la mañana' },
      Vespertino: { horario: '13:00 a 19:00', descripcion: 'Turno de la tarde' },
      Nocturno: { horario: '19:00 a 22:00', descripcion: 'Turno de la noche' },
      Personalizado: {
        horario: `${this.horaInicio} a ${this.horaFin}`,
        descripcion: 'Horario definido por el usuario'
      }
    };

    return this.selectedTurno ? turnosData[this.selectedTurno] : null;
  }

  // Al cambiar grupo, convertir a número y guardar estado - CORREGIDO
  onGrupoChange(event: any) {
    if (event && event.target && event.target.value) {
      // Convertir el valor del select a número
      const selectedValue = event.target.value;
      this.grupoSeleccionado = selectedValue === 'null' ? null : Number(selectedValue);
    }
    
    console.log('Grupo seleccionado:', this.grupoSeleccionado, typeof this.grupoSeleccionado);
    this.saveFormState();
  }

  // Al cambiar aula, convertir a número y guardar estado - CORREGIDO
  onAulaChange(event: any) {
    if (event && event.target && event.target.value) {
      // Convertir el valor del select a número
      const selectedValue = event.target.value;
      this.aulaSeleccionada = selectedValue === 'null' ? null : Number(selectedValue);
    }
    
    console.log('Aula seleccionada:', this.aulaSeleccionada, typeof this.aulaSeleccionada);
    this.saveFormState();
  }

  // Guardar días seleccionados desde Tab2
  onDiasSeleccionadosChange(dias: string[]) {
    this.diasSeleccionados = dias;
    this.resumen.dias = [...dias];
    console.log('Días seleccionados:', this.diasSeleccionados);
  }

  // Actualizar resumen antes de pasar a Tab2 - CORREGIDO
  private updateResumen() {
    const info = this.getInfoTurno();
    
    if (info && info.horario) {
      const [hi, hf] = info.horario.split(' a ');
      
      // Buscar el grupo seleccionado - Asegurar comparación correcta
      const grupoEncontrado = this.grupos.find(g => Number(g.id) === Number(this.grupoSeleccionado));
      
      // Buscar el aula seleccionada - Asegurar comparación correcta
      const aulaEncontrada = this.aulas.find(a => Number(a.id) === Number(this.aulaSeleccionada));
      
      this.resumen = {
        turno: this.selectedTurno || '',
        horario: `${hi} - ${hf}`,
        tipoDuracion: this.selectedTurno === 'Personalizado' ? 'Personalizada' : 'Estandar',
        duracionClases: this.minutosPorClase,
        grupo: grupoEncontrado ? `${grupoEncontrado.nombre} • ${grupoEncontrado.semestre}` : 'No seleccionado',
        grupoId: this.grupoSeleccionado,
        aula: aulaEncontrada ? aulaEncontrada.nombre : 'No seleccionada',
        aulaId: this.aulaSeleccionada,
        dias: this.diasSeleccionados
      };
      
      console.log('Resumen actualizado:', this.resumen);
      console.log('Grupo encontrado:', grupoEncontrado);
      console.log('Aula encontrada:', aulaEncontrada);
      console.log('this.grupoSeleccionado:', this.grupoSeleccionado, typeof this.grupoSeleccionado);
      console.log('Grupos disponibles:', this.grupos.map(g => ({ id: g.id, tipo: typeof g.id })));
    }
  }

  // Utilerías de conversión
  private timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  private minutesToTime(m: number) {
    return `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
  }
}