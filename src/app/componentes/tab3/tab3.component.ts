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
    horario: string;
    tipoDuracion: string;
    duracionClases: number;
    grupo: string;
    grupoId: number | null;    // <-- agregado
    aula: string;
    aulaId: number | null;     // <-- agregado
    dias: string[];
  } | null = null;


  @Input() currentTab: 'formato' | 'dias' | 'diseno' = 'formato';
  @Output() tabChange = new EventEmitter<'formato' | 'dias' | 'diseno'>();

  asignaciones: any[] = [];
  horarioAsignado: { [key: string]: any[] } = {};
  loading = true;
  error: string | null = null;
  
  // Horas del horario
  horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Elemento que se está arrastrando actualmente
  currentDragItem: any = null;
  
  // Para mantener registro de la celda actualmente en hover durante el arrastre
  activeCellKey: string | null = null;

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
  
    forkJoin({
      asignaciones: this.asignService.obtenerAsignaciones()
    }).subscribe({
      next: ({ asignaciones }) => {
        console.log('Tab3: asignaciones recibidas', asignaciones);
        this.asignaciones = asignaciones;
        this.loading = false;
  
        this.generarHorasDesdeResumen(); // ✅ aquí sí es válido
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

  getHoraFin(horaInicio: string): string {
    const [h, m] = horaInicio.split(':').map(Number);
    const nuevaHora = h + 1;
    return `${nuevaHora.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
  
  
  


  private colorPalette = [
    '#2E7D32', // verde bosque
    '#FFB300', // dorado oscuro
    '#0288D1', // azul petróleo
    '#D84315', // rojo teja
    '#6A1B9A', // púrpura profundo
    '#00897B', // verde azulado
    '#F57F17', // amarillo mostaza
    '#5D4037', // marrón café
    '#455A64', // gris azulado
    '#1E88E5', // azul vibrante
    '#C62828', // granate
    '#AD1457', // rosa oscuro
    '#2C387E', // azul noche
    '#33691E', // verde oliva oscuro
    '#4E342E', // marrón oscuro
    '#37474F'  // pizarra oscura
  ];
  

  private materiaColorMap = new Map<number, string>();

  getColorForMateria(materiaId: number): string {
    if (!this.materiaColorMap.has(materiaId)) {
      const nextIndex = this.materiaColorMap.size % this.colorPalette.length;
      this.materiaColorMap.set(materiaId, this.colorPalette[nextIndex]);
    }
    return this.materiaColorMap.get(materiaId)!;
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


  private generarHorasDesdeResumen() {
    this.horas = [];
    const [hInicio, mInicio] = this.resumen!.horario.split(' - ')[0].split(':').map(n => +n);
    const [hFin, mFin]     = this.resumen!.horario.split(' - ')[1].split(':').map(n => +n);
    const dur = this.resumen!.duracionClases; // minutos
    let current = hInicio * 60 + mInicio;
    const end = hFin * 60 + mFin;

    while (current + dur <= end) {
      const hh = Math.floor(current/60).toString().padStart(2,'0');
      const mm = (current%60).toString().padStart(2,'0');
      this.horas.push(`${hh}:${mm}`);
      current += dur;
    }
  }
}