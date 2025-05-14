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
  aulaSeleccionada: string = '';

  // --- Standard schedule ---
  clasesPorDia: number = 5;

  // --- Custom schedule ---
  minutosPorClase: number = 50; // between 50 and 60
  horaInicio: string = '';
  horaFin: string = '';

  showCustomSchedule = false;
  horasGeneradas: { horaInicio: string; horaFin: string; duracion: number }[] = [];
handleTabChange: any;

  constructor(
    private aulasService: AulasService,
    private gruposService: GruposService,
    private horariosService: HorariosService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.loadCustomState();
    this.getAulasConsola();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 1) Initial load
  private loadInitialData() {
    forkJoin({
      aulas: this.aulasService.obtenerAulas(),
      grupos: this.gruposService.getGrupos(),
      enums: this.horariosService.getEnums()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ aulas, grupos, enums }) => {
          // Validación de los datos de aulas
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
  
          // Validación de los datos de grupos
          if (Array.isArray(grupos)) {
            this.grupos = grupos;
          } else {
            console.warn('[WARNING] Los grupos no tienen el formato esperado.');
            this.grupos = [];
          }
  
          // Validación de los enums
          if (enums && enums.turnos && Array.isArray(enums.turnos)) {
            this.turnos = enums.turnos;
          } else {
            console.warn('[WARNING] Los turnos no están definidos correctamente.');
            this.turnos = [];
          }
  
          if (enums && enums.diasSemana && Array.isArray(enums.diasSemana)) {
            this.diasSemana = enums.diasSemana;
          } else {
            console.warn('[WARNING] Los días de la semana no están definidos correctamente.');
            this.diasSemana = [];
          }
  
          if (enums && enums.tiposDuracion && Array.isArray(enums.tiposDuracion)) {
            this.tiposDuracion = enums.tiposDuracion;
          } else {
            console.warn('[WARNING] Los tipos de duración no están definidos correctamente.');
            this.tiposDuracion = [];
          }
        },
        error: (err) => {
          console.error('[ERROR] loadInitialData:', err);
          // Mostrar un mensaje al usuario o realizar alguna acción específica en caso de error
          alert('Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        }
      });
  }
  

  // 2) Load/Save state
  private loadCustomState() {
    const h = localStorage.getItem('horasPersonalizadas');
    this.horasGeneradas = h ? JSON.parse(h) : [];

    const form = localStorage.getItem('crearHorarioForm');
    if (form) {
      const s = JSON.parse(form);
      this.selectedTurno = s.selectedTurno;
      this.clasesPorDia = s.clasesPorDia;
      this.minutosPorClase = s.minutosPorClase;
      this.horaInicio = s.horaInicio;
      this.horaFin = s.horaFin;
      this.grupoSeleccionado = s.grupoSeleccionado;
      this.aulaSeleccionada = s.aulaSeleccionada;
    }
  }
  private saveCustomHours() {
    localStorage.setItem('horasPersonalizadas', JSON.stringify(this.horasGeneradas));
  }
  private saveFormState() {
    const state = {
      selectedTurno: this.selectedTurno,
      clasesPorDia: this.clasesPorDia,
      minutosPorClase: this.minutosPorClase,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      grupoSeleccionado: this.grupoSeleccionado,
      aulaSeleccionada: this.aulaSeleccionada
    };
    localStorage.setItem('crearHorarioForm', JSON.stringify(state));
  }




 // 3) Tab navigation
selectTab(tab: TabKey) {
  if (!this.tabs.includes(tab)) return;

  // Si el nuevo tab es 'dias', actualizamos el resumen antes de renderizar
  if (tab === 'dias') {
    const info = this.getInfoTurno();
    if (info && info.horario) {
      const [hi, hf] = info.horario.split(' a ');
      this.resumen = {
        turno:          this.selectedTurno  || '',
        horario:        `${hi} - ${hf}`,
        tipoDuracion:   this.selectedTurno === 'Personalizado' ? 'Personalizada' : 'Estandar',
        duracionClases: this.minutosPorClase,
        grupo:          this.grupos.find(g => g.id === this.grupoSeleccionado!)?.grupo_nombre || 'No seleccionado',
        grupoId:        this.grupoSeleccionado,            // ← aquí
        aula:           this.aulas.find(a => a.id === +this.aulaSeleccionada!)?.nombre || 'No seleccionada',
        aulaId:         +this.aulaSeleccionada!,           // ← y aquí
        dias:           this.diasSeleccionados
      };
    }
  }
  

  this.currentTab = tab;
}

nextTab() {
  const turnoInfo = this.getInfoTurno();
  if (!turnoInfo || !turnoInfo.horario) {
    return console.error('Turno no válido o sin horario definido.');
  }

  // Guardado de formato en localStorage
  const [horaInicio, horaFin] = turnoInfo.horario.split(' a ');
  const datosFormato = {
    selectedTurno: this.selectedTurno,
    clasesPorDia: this.clasesPorDia,
    minutosPorClase: this.minutosPorClase,
    horaInicio,
    horaFin,
    grupoSeleccionado: this.grupoSeleccionado,
    aulaSeleccionada: this.aulaSeleccionada,
    horasGeneradas: this.horasGeneradas
  };
  localStorage.setItem('crearHorarioForm', JSON.stringify(datosFormato));
  console.log('Datos guardados del formato:', datosFormato);

  // Ahora reutilizamos selectTab para hacer el build del resumen
  this.selectTab('dias');
}

  
  

  // 4) Turn logic
  onTurnoChange() {
    if (!this.selectedTurno) return;
    if (this.selectedTurno === 'Personalizado') {
      this.showCustomSchedule = true;
      this.horasGeneradas = [];
    } else {
      this.showCustomSchedule = false;
      this.generateStandardSchedule();
    }
  }
  onClasesPorDiaChange() {
    if (this.selectedTurno && this.selectedTurno !== 'Personalizado') {
      this.generateStandardSchedule();
    }
  }

  private generateStandardSchedule() {
    const info = this.getInfoTurno();
    if (!info) return;
    const [hi, hf] = info.horario.split(' a ');
    const start = this.timeToMinutes(hi);
    const end = this.timeToMinutes(hf);
    const total = end - start;
    const slot = Math.floor(total / this.clasesPorDia);
    const slots: any[] = [];
    let cur = start;
    for (let i = 0; i < this.clasesPorDia; i++) {
      const nxt = cur + slot;
      slots.push({ horaInicio: this.minutesToTime(cur), horaFin: this.minutesToTime(nxt), duracion: slot });
      cur = nxt;
    }
    this.horasGeneradas = slots;
  }

  // 5) Custom schedule generation
  generateCustomSchedule() {
    if (!this.horaInicio || !this.horaFin) return;
    if (this.minutosPorClase < 50 || this.minutosPorClase > 60) return;
    const start = this.timeToMinutes(this.horaInicio);
    const end = this.timeToMinutes(this.horaFin);
    if (end <= start) return;
    const slots: any[] = [];
    let cur = start;
    while (cur + this.minutosPorClase <= end) {
      const nxt = cur + this.minutosPorClase;
      slots.push({ horaInicio: this.minutesToTime(cur), horaFin: this.minutesToTime(nxt), duracion: this.minutosPorClase });
      cur = nxt;
    }
    this.horasGeneradas = slots;
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


  // 6) Load aulas
  getAulasConsola(): void {
    this.aulasService.obtenerAulas().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        const arr = Array.isArray(res)
          ? res
          : Array.isArray((res as any).data)
          ? (res as any).data
          : (res as any).aulas || [];
        this.aulas = arr;
        console.log('Aulas:', arr);
      },
      error: err => console.error('[ERROR] getAulasConsola:', err)
    });
  }

  // Utility
  private timeToMinutes(t: string) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
  private minutesToTime(m: number) { return `${Math.floor(m/60).toString().padStart(2,'0')}:${(m%60).toString().padStart(2,'0')}`; }


  resumen: {
    turno: string;
    horario: string;
    tipoDuracion: string;
    duracionClases: number;
    grupo: string;
    grupoId: number | null;    // ← agregado
    aula: string;
    aulaId: number | null;     // ← agregado
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
  

  onDiasSeleccionadosChange(dias: string[]) {
    this.diasSeleccionados = dias;
    console.log('Días en el padre:', this.diasSeleccionados);

    // (Opcional) Actualizar el resumen aquí si quieres
    this.resumen.dias = [...dias];
  }
}