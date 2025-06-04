import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { forkJoin } from 'rxjs';

import { AsignacionMateriasService } from '../../core/asignaciones/asignacion-materias.service';
import { Horario, HorariosService } from '../../core/horarios/horarios.service';

@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.css']
})
export class Tab3Component implements OnInit {

  @Input() diasSeleccionados: string[] = [];
  @Input() resumen: {
    turno: string;
    horario: string;           // ej: "17:00 - 22:00"
    tipoDuracion: string;
    duracionClases: number;    // ej: 50 (minutos)
    grupo: string;
    grupoId: number | null;
    aula: string;
    aulaId: number | null;
    dias: string[];
  } | null = null;

  @Input() currentTab: 'formato' | 'dias' | 'diseno' = 'formato';
  @Output() tabChange = new EventEmitter<'formato' | 'dias' | 'diseno'>();

  asignaciones: any[] = [];
  horarioAsignado: { [key: string]: any[] } = {};
  loading = true;
  error: string | null = null;
  
  // Horas del horario - se generarán dinámicamente
  horas: string[] = [];
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Elemento que se está arrastrando actualmente
  currentDragItem: any = null;
  
  // Para mantener registro de la celda actualmente en hover durante el arrastre
  activeCellKey: string | null = null;

  // ✅ Color general para todas las asignaciones
  private colorGeneral = '#2E7D32'; // Verde bosque profesional

  constructor(
    private horariosService: HorariosService,
    private asignService: AsignacionMateriasService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log('Tab3: iniciar carga de datos');
    console.log('Tab3 recibe por Input:', {
      resumen: this.resumen,
      diasSeleccionados: this.diasSeleccionados
    });

    // ✅ Generar horas basándose en la configuración del resumen
    this.generarHorasDesdeResumen();
  
    forkJoin({
      asignaciones: this.asignService.obtenerAsignaciones()
    }).subscribe({
      next: ({ asignaciones }) => {
        console.log('Tab3: asignaciones recibidas', asignaciones);
        this.asignaciones = asignaciones;
        this.loading = false;
      },
      error: (err) => {
        console.error('Tab3: error cargando datos', err);
        this.error = 'No se pudieron cargar asignaciones y horarios.';
        this.loading = false;
      }
    });
  }
  
  navegarTab(dir: 'anterior' | 'siguiente') {
    const next =
      dir === 'anterior'
        ? (this.currentTab === 'dias' ? 'formato' : 'dias')
        : (this.currentTab === 'formato' ? 'dias' : 'diseno');
    this.tabChange.emit(next);
  }

  // Drag & Drop mejorado
  onDragStart(event: DragEvent, asignacion: any) {
    this.currentDragItem = asignacion;
    
    // Crear una imagen personalizada para el arrastre
    const dragIcon = document.createElement('div');
    dragIcon.classList.add('drag-preview');
    dragIcon.innerHTML = `
      <div class="preview-profesor">${asignacion.profesorNombre}</div>
      <div class="preview-materia">${asignacion.materiaNombre}</div>
    `;
    document.body.appendChild(dragIcon);
    
    // Ajustar el dragIcon para que sea invisible pero funcional
    dragIcon.style.position = 'absolute';
    dragIcon.style.top = '-9999px';
    dragIcon.style.left = '-9999px';
    
    // Establecer la imagen de arrastre
    event.dataTransfer?.setDragImage(dragIcon, 20, 20);
    
    // Añadir la clase 'dragging' al elemento original
    const element = event.target as HTMLElement;
    this.renderer.addClass(element, 'dragging');
    
    event.dataTransfer?.setData('application/json', JSON.stringify(asignacion));
    
    // Eliminar el elemento después de un breve retraso
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  }

  onDragEnd(event: any) {
    // Eliminar la clase 'dragging' del elemento original
    const element = event.target as HTMLElement;
    this.renderer.removeClass(element, 'dragging');
    this.currentDragItem = null;
    
    // Limpiar cualquier celda activa
    if (this.activeCellKey) {
      const cells = document.querySelectorAll('.celda-horario');
      cells.forEach(cell => {
        this.renderer.removeClass(cell, 'drag-over');
      });
      this.activeCellKey = null;
    }
  }

  onDragOver(event: DragEvent, dia: string, hora: string) {
    event.preventDefault(); // necesario para permitir drop
    
    // Añadir clase visual a la celda actual
    const cellKey = `${dia}-${hora}`;
    if (this.activeCellKey !== cellKey) {
      // Eliminar clase de la celda anterior
      if (this.activeCellKey) {
        const prevCell = document.querySelector(`[data-cell="${this.activeCellKey}"]`);
        if (prevCell) {
          this.renderer.removeClass(prevCell, 'drag-over');
        }
      }
      
      // Añadir clase a la nueva celda
      const currentCell = event.currentTarget as HTMLElement;
      this.renderer.addClass(currentCell, 'drag-over');
      this.activeCellKey = cellKey;
    }
  }

  onDragLeave(event: DragEvent) {
    const cell = event.currentTarget as HTMLElement;
    this.renderer.removeClass(cell, 'drag-over');
    this.activeCellKey = null;
  }

  onDrop(event: DragEvent, dia: string, horaInicio: string, horaFin: string) {
    event.preventDefault();
    
    // Eliminar clase visual
    const cell = event.currentTarget as HTMLElement;
    this.renderer.removeClass(cell, 'drag-over');
    this.activeCellKey = null;
    
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      const asignacion = JSON.parse(data);
      const clave = `${dia}-${horaInicio}`;
      
      if (!this.horarioAsignado[clave]) {
        this.horarioAsignado[clave] = [];
      }

      // evitar duplicados
      const existe = this.horarioAsignado[clave].some(
        (a) =>
          a.profesorId === asignacion.profesorId &&
          a.materiaId === asignacion.materiaId
      );
      
      if (!existe) {
        // Añadir con una animación
        const nuevaAsignacion = {
          ...asignacion,
          horaInicio,
          horaFin,
          dia,
          isNew: true // Para aplicar animación
        };
        
        this.horarioAsignado[clave].push(nuevaAsignacion);
        
        // Quitar la bandera isNew después de la animación
        setTimeout(() => {
          nuevaAsignacion.isNew = false;
        }, 500);
      }
    }
  }

  // ✅ Método mejorado para calcular hora de fin basado en la duración detectada automáticamente
  getHoraFin(horaInicio: string): string {
    // Usar la duración detectada automáticamente
    const duracionMinutos = this.determinarDuracionPorTurno();

    try {
      const [h, m] = horaInicio.split(':').map(n => parseInt(n, 10));
      const tiempoInicioMin = h * 60 + m;
      const tiempoFinMin = tiempoInicioMin + duracionMinutos;
      
      const horaFin = Math.floor(tiempoFinMin / 60);
      const minutoFin = tiempoFinMin % 60;
      
      return `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error calculando hora fin:', error);
      // Fallback
      const [h, m] = horaInicio.split(':').map(Number);
      const nuevaHora = h + 1;
      return `${nuevaHora.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
  }

  // Eliminar una asignación del horario
  eliminarAsignacion(dia: string, hora: string, index: number) {
    const clave = `${dia}-${hora}`;
    if (this.horarioAsignado[clave] && this.horarioAsignado[clave].length > index) {
      // Primero marcar para animación de eliminación
      this.horarioAsignado[clave][index].isRemoving = true;
      
      // Después de la animación, eliminar del array
      setTimeout(() => {
        this.horarioAsignado[clave].splice(index, 1);
        if (this.horarioAsignado[clave].length === 0) {
          delete this.horarioAsignado[clave];
        }
      }, 300);
    }
  }

  guardarHorario() {
    // 0) Loguear IDs de asignaciones, turno, grupo y aula
    const placedIds = new Set<number>();
    for (const clave in this.horarioAsignado) {
      this.horarioAsignado[clave].forEach(asig => placedIds.add(asig.id));
    }
    console.log('IDs de asignaciones en el diseño:', Array.from(placedIds));
    console.log('Turno seleccionado en el diseño:', this.resumen?.turno);
    console.log('Grupo seleccionado ID:', this.resumen?.grupoId);
    console.log('Aula seleccionada ID:', this.resumen?.aulaId);
  
    // 1) Construimos el array para enviar al servicio, añadiendo turno, grupoId y aulaId
    const entradas: Array<Partial<Horario> & { turno: string; grupo_id: number | null; aula_id: number | null }> = [];
    for (const clave in this.horarioAsignado) {
      for (const asignacion of this.horarioAsignado[clave]) {
        entradas.push({
          dia_semana:  asignacion.dia,
          hora_inicio: asignacion.horaInicio,
          hora_fin:    asignacion.horaFin,
          asignacion_id: asignacion.id,
          turno:         this.resumen?.turno!,
          grupo_id:      this.resumen?.grupoId ?? null,
          aula_id:       this.resumen?.aulaId  ?? null
        });
      }
    }
  
    if (entradas.length === 0) {
      console.warn('No hay asignaciones para guardar.');
      return;
    }
  
    // 2) Envío y controles de éxito/error
    let exitos = 0;
    let errores = 0;
    entradas.forEach((entry, idx) => {
      this.horariosService.createHorario(entry).subscribe({
        next: () => {
          exitos++;
          if (exitos + errores === entradas.length) {
            console.log(`Guardado completado: ${exitos} éxitos, ${errores} errores.`);
          }
        },
        error: (err) => {
          errores++;
          console.error(`Error guardando entrada #${idx}:`, err);
          if (exitos + errores === entradas.length) {
            console.log(`Guardado completado: ${exitos} éxitos, ${errores} errores.`);
          }
        }
      });
    });
  }

  // ✅ MÉTODO SIMPLIFICADO: Color general para todas las asignaciones
  getColorGeneral(): string {
    return this.colorGeneral;
  }

  getInitialData(): { 
    resumen: { 
      aula: string;
      dias: string[];
      duracionClases: number;
      grupo: string;
      horario: string;
      tipoDuracion: string;
      turno: string;
    } | null;
    diasSeleccionados: string[];
    timestamp: string;
  } {
    const data = {
      resumen: this.resumen,
      diasSeleccionados: this.diasSeleccionados,
      timestamp: new Date().toISOString()
    };
    console.log('Tab3Component getInitialData():', data);
    return data;
  }
 
  // Verificar conflictos en el horario
  tieneConflicto(dia: string, hora: string): boolean {
    const clave = `${dia}-${hora}`;
    return this.horarioAsignado[clave]?.length > 1;
  }

  // ✅ MÉTODO PRINCIPAL CORREGIDO: Turnos predefinidos usan 60 minutos
  private determinarDuracionPorTurno(): number {
    if (!this.resumen?.turno) {
      console.warn('No hay turno definido, usando 60 minutos por defecto');
      return 60;
    }

    const turno = this.resumen.turno.toLowerCase();
    console.log('Analizando turno para determinar duración:', turno);

    // Si ya viene configurada la duración en el resumen, usarla
    if (this.resumen.duracionClases && this.resumen.duracionClases > 0) {
      console.log('Usando duración configurada en el resumen:', this.resumen.duracionClases);
      return this.resumen.duracionClases;
    }

    // ✅ LÓGICA CORREGIDA: Turnos predefinidos usan 60 minutos
    switch (turno) {
      case 'matutino':
      case 'vespertino':  
      case 'nocturno':
        // ✅ CORRECCIÓN: Turnos predefinidos usan 60 minutos (no 50)
        console.log('Turno predefinido detectado, usando 60 minutos');
        return 60;
        
      case 'personalizado':
        // Turnos personalizados: detectar según el horario con lógica inteligente
        const duracionDetectada = this.detectarDuracionPorHorario();
        console.log('Turno personalizado, duración detectada:', duracionDetectada);
        return duracionDetectada;
        
      default:
        // Si el turno no coincide con los patrones conocidos, intentar detectar por horario
        console.log('Turno no reconocido, detectando por horario');
        return this.detectarDuracionPorHorario();
    }
  }

  // ✅ Detectar duración para turnos personalizados basándose en eficiencia
  private detectarDuracionPorHorario(): number {
    if (!this.resumen?.horario) {
      return 60; // Fallback
    }

    try {
      const [rangoInicio, rangoFin] = this.resumen.horario.split(' - ');
      const [hInicio, mInicio] = rangoInicio.split(':').map(n => parseInt(n, 10));
      const [hFin, mFin] = rangoFin.split(':').map(n => parseInt(n, 10));
      
      const tiempoTotalMinutos = (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
      
      console.log('Análisis de horario personalizado:', {
        horario: this.resumen.horario,
        tiempoTotalMinutos: tiempoTotalMinutos,
        horasDisponibles: tiempoTotalMinutos / 60
      });

      // ✅ Heurística para detectar si es mejor 50 o 60 minutos
      const clasesCon50 = Math.floor(tiempoTotalMinutos / 50);
      const clasesCon60 = Math.floor(tiempoTotalMinutos / 60);
      
      console.log('Comparación de eficiencia para turno personalizado:', {
        clasesCon50: clasesCon50,
        clasesCon60: clasesCon60,
        tiempoSobranteCon50: tiempoTotalMinutos % 50,
        tiempoSobranteCon60: tiempoTotalMinutos % 60
      });

      // Preferir 50 minutos si:
      // 1. Da más clases que 60 minutos, O
      // 2. Da la misma cantidad pero con menos tiempo sobrante
      if (clasesCon50 > clasesCon60) {
        console.log('Eligiendo 50 minutos: más clases disponibles');
        return 50;
      } else if (clasesCon50 === clasesCon60) {
        const sobranteCon50 = tiempoTotalMinutos % 50;
        const sobranteCon60 = tiempoTotalMinutos % 60;
        
        if (sobranteCon50 <= sobranteCon60) {
          console.log('Eligiendo 50 minutos: mismo número de clases, menos tiempo sobrante');
          return 50;
        } else {
          console.log('Eligiendo 60 minutos: menos tiempo sobrante');
          return 60;
        }
      } else {
        console.log('Eligiendo 60 minutos: configuración estándar');
        return 60;
      }
      
    } catch (error) {
      console.error('Error detectando duración por horario:', error);
      return 60; // Fallback seguro
    }
  }

  // ✅ Método mejorado para generar horas dinámicamente con detección inteligente
  private generarHorasDesdeResumen() {
    this.horas = [];
    
    if (!this.resumen || !this.resumen.horario) {
      console.warn('No hay resumen o horario disponible para generar horas');
      this.horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
      return;
    }

    try {
      // Extraer horario de inicio y fin del formato "17:00 - 22:00"
      const [rangoInicio, rangoFin] = this.resumen.horario.split(' - ');
      const [hInicio, mInicio] = rangoInicio.split(':').map(n => parseInt(n, 10));
      const [hFin, mFin] = rangoFin.split(':').map(n => parseInt(n, 10));
      
      // ✅ Usar la detección inteligente de duración
      const duracionMinutos = this.determinarDuracionPorTurno();
      
      // Convertir a minutos desde medianoche
      let tiempoActual = hInicio * 60 + mInicio;
      const tiempoFin = hFin * 60 + mFin;
      const tiempoTotalDisponible = tiempoFin - tiempoActual;

      console.log('Generando horario con detección inteligente:', {
        turno: this.resumen.turno,
        horarioOriginal: this.resumen.horario,
        duracionDetectada: duracionMinutos,
        tiempoTotalMinutos: tiempoTotalDisponible,
        configuracionOriginal: this.resumen.duracionClases
      });

      // Calcular cuántas clases caben exactamente
      const clasesQueCalben = Math.floor(tiempoTotalDisponible / duracionMinutos);
      
      console.log(`Con clases de ${duracionMinutos}min caben ${clasesQueCalben} períodos en ${tiempoTotalDisponible}min`);

      // Generar horarios mientras quepa una clase completa
      let claseCount = 0;
      while (tiempoActual + duracionMinutos <= tiempoFin && claseCount < clasesQueCalben) {
        const horas = Math.floor(tiempoActual / 60);
        const minutos = tiempoActual % 60;
        const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        
        this.horas.push(horaFormateada);
        console.log(`Período ${claseCount + 1}: ${horaFormateada} (${duracionMinutos}min)`);
        
        tiempoActual += duracionMinutos;
        claseCount++;
      }

      console.log('Horarios generados finales:', this.horas);
      console.log(`Total de períodos de clase: ${this.horas.length}`);
      
      // ✅ Validación final
      if (this.horas.length === 0) {
        console.warn('No se generaron horarios válidos. Verificar configuración.');
        console.warn('Usando horario por defecto como fallback');
        this.horas = this.generarHorarioFallback();
      }
      
    } catch (error) {
      console.error('Error al generar horas desde resumen:', error);
      console.error('Resumen recibido:', this.resumen);
      // Fallback a horario por defecto si hay error
      this.horas = this.generarHorarioFallback();
    }
  }

  // ✅ Método auxiliar para horario de fallback
  private generarHorarioFallback(): string[] {
    const horarioFallback = [];
    for (let hora = 8; hora <= 14; hora++) {
      horarioFallback.push(`${hora.toString().padStart(2, '0')}:00`);
    }
    console.log('Usando horario fallback:', horarioFallback);
    return horarioFallback;
  }
}