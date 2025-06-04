import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideChecadorComponent } from '../componentes/aside-checador/aside-checador.component';
import { AsistenciaTemaService } from '../core/asistencia-tema/asistencia-tema.service';
import { GrupoHorarios, HorariosService } from '../core/horarios/horarios.service';

interface Slot {
  inicio: string;
  fin: string;
}

type RegistroTipo = 'Asistió' | 'No Asistió' | 'Justificado';

@Component({
  selector: 'app-checador',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideChecadorComponent],
  templateUrl: './checador.component.html',
  styleUrls: ['./checador.component.css']
})
export class ChecadorComponent implements OnInit {
  // Datos de grupos y usuario
  grupos: GrupoHorarios[] = [];
  usuarioId = 0;

  // Modal y selección de clase
  showAsistenciaModal = false;
  selectedClase: any = null;

  // Filtros de horario
  selectedGrupoId: number | null = null;
  selectedTurno = '';
  selectedDia = '';  // Nuevo filtro por día
  selectedHora = '';  // Nuevo filtro por hora
  
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  slots: Slot[] = [];
  horasDisponibles: string[] = [];  // Nuevo array para horas disponibles
  horariosPorDia: Record<string, Record<string, any>> = {};
  
  // Nuevas propiedades para mostrar datos filtrados
  clasesFiltradasPorDia: any[] = [];
  clasesFiltradasPorHora: any[] = [];

  // Opciones de tipo de asistencia
  asistenciaTipos: RegistroTipo[] = ['Asistió', 'No Asistió', 'Justificado'];

  // Referencias al formulario del modal
  @ViewChild('fechaInput') fechaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tipoSelect') tipoSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('temaTextarea') temaTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private horariosService: HorariosService,
    private asistenciaService: AsistenciaTemaService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeJwtPayload(token);
      this.usuarioId = payload?.id ?? 0;
    }
  }

  ngOnInit(): void {
    if (this.usuarioId <= 0) return;
    this.horariosService.getGruposPorChecador(this.usuarioId).subscribe({
      next: g => this.grupos = g,
      error: e => console.error('[Checador] Error cargando grupos:', e)
    });
  }

  onGrupoChange(): void {
    console.clear();
    console.log('--- onGrupoChange ---');
    console.log('selectedGrupoId:', this.selectedGrupoId);
    console.log('selectedTurno:', this.selectedTurno);

    if (!this.selectedGrupoId || !this.selectedTurno) {
      this.resetFilters();
      return;
    }

    const grupo = this.grupos.find(g => g.grupo_id === this.selectedGrupoId);
    console.log('Grupo encontrado:', grupo);
    if (!grupo) {
      console.warn('No se encontró el grupo.');
      this.resetFilters();
      return;
    }

    // Aplanar y filtrar
    const todos: any[] = [];
    grupo.horarios.forEach(d => {
      console.log(`Procesando día ${d.dia_semana}`, d.horarios_del_dia);
      d.horarios_del_dia
        .filter((h: any) => h.turno === this.selectedTurno)
        .forEach((h: any) => {
          const item = { ...h, dia_semana: d.dia_semana };
          todos.push(item);
          console.log(' ➜ Añadido al array "todos":', item);
        });
    });
    console.log('Array "todos" completo:', todos);

    // Construir horariosPorDia
    this.horariosPorDia = {};
    todos.forEach(item => {
      this.horariosPorDia[item.dia_semana] ||= {};
      this.horariosPorDia[item.dia_semana][item.hora_inicio] = item;
    });
    console.log('Mapa horariosPorDia:', this.horariosPorDia);

    // Extraer y ordenar slots
    const map = new Map<string, string>();
    todos.forEach(e => {
      if (!map.has(e.hora_inicio)) {
        map.set(e.hora_inicio, e.hora_fin);
        console.log(`Slot agregado: ${e.hora_inicio} - ${e.hora_fin}`);
      }
    });
    this.slots = Array.from(map.entries())
      .map(([inicio, fin]) => ({ inicio, fin }))
      .sort((a, b) => a.inicio.localeCompare(b.inicio));
    console.log('Slots finales:', this.slots);

    // Construir array de horas disponibles
    this.horasDisponibles = this.slots.map(slot => slot.inicio);
    
    // Resetear filtros específicos
    this.selectedDia = '';
    this.selectedHora = '';
    this.aplicarFiltros();
  }

  onDiaChange(): void {
    console.log('Día seleccionado:', this.selectedDia);
    this.aplicarFiltros();
  }

  onHoraChange(): void {
    console.log('Hora seleccionada:', this.selectedHora);
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    // Resetear arrays filtrados
    this.clasesFiltradasPorDia = [];
    this.clasesFiltradasPorHora = [];

    if (this.selectedDia) {
      // Filtrar por día específico
      const clasesDia = this.horariosPorDia[this.selectedDia] || {};
      this.clasesFiltradasPorDia = Object.keys(clasesDia)
        .map(hora => ({
          ...clasesDia[hora],
          hora_slot: hora
        }))
        .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    }

    if (this.selectedHora) {
      // Filtrar por hora específica
      this.clasesFiltradasPorHora = [];
      this.diasSemana.forEach(dia => {
        const clase = this.horariosPorDia[dia]?.[this.selectedHora];
        if (clase) {
          this.clasesFiltradasPorHora.push({
            ...clase,
            dia_semana: dia
          });
        }
      });
    }
  }

  resetFilters(): void {
    this.slots = [];
    this.horasDisponibles = [];
    this.horariosPorDia = {};
    this.selectedDia = '';
    this.selectedHora = '';
    this.clasesFiltradasPorDia = [];
    this.clasesFiltradasPorHora = [];
    console.log('Filtros reseteados');
  }

  // Método para determinar qué vista mostrar
  shouldShowFullTable(): boolean {
    return !this.selectedDia && !this.selectedHora && this.slots.length > 0;
  }

  shouldShowDayFilter(): boolean {
    return this.selectedDia !== '' && !this.selectedHora;
  }

  shouldShowHourFilter(): boolean {
    return this.selectedHora !== '' && !this.selectedDia;
  }

  shouldShowBothFilters(): boolean {
    return this.selectedDia !== '' && this.selectedHora !== '';
  }

  getCell(dia: string, inicio: string): any | null {
    return this.horariosPorDia[dia]?.[inicio] ?? null;
  }

  toggleAsistenciaModal(): void {
    this.showAsistenciaModal = !this.showAsistenciaModal;
    if (!this.showAsistenciaModal) {
      this.selectedClase = null;
    }
  }

  marcarAsistenciaClase(cell: any): void {
    this.selectedClase = { ...cell };
    this.showAsistenciaModal = true;
  }

  guardarAsistencia(): void {
    if (!this.selectedClase) return;

    // 1) Lees valores del formulario
    const fecha = this.fechaInput.nativeElement.value;
    const tipo = this.tipoSelect.nativeElement.value as RegistroTipo;
    const tema = this.temaTextarea.nativeElement.value || '';

    // 2) Construyes el payload con los campos exactos
    const payload = {
      asignacion_id: this.selectedClase.asignacion_id,
      asistio: tipo,
      registrado_por_id: this.usuarioId,
      tema: tema
    };

    console.log('Payload de asistencia:', payload);

    // 3) Llamas al servicio
    this.asistenciaService.registrarAsistenciaYTema(payload).subscribe({
      next: () => {
        alert('Asistencia registrada correctamente.');
        this.toggleAsistenciaModal();
      },
      error: err => {
        console.error('Error al registrar asistencia:', err);
        alert(err.error?.message || 'Ocurrió un error al guardar.');
      }
    });
  }

  getCurrentDate(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private decodeJwtPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}