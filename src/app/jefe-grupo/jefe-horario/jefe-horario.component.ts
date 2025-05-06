import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsideJefeGrupoComponent } from '../../componentes/aside-jefe-grupo/aside-jefe-grupo.component';
import { ModalRegistrarTemaAsistenciaComponent, SaveEvent } from '../../componentes/modal-registrar-tema-asistencia/modal-registrar-tema-asistencia.component';
import { Horario, HorariosService } from '../../core/horarios/horarios.service';

@Component({
  selector: 'app-jefe-horario',
  standalone: true,
  imports: [AsideJefeGrupoComponent, CommonModule, ModalRegistrarTemaAsistenciaComponent],
  templateUrl: './jefe-horario.component.html',
  styleUrls: ['./jefe-horario.component.css']
})
export class JefeHorarioComponent implements OnInit {
  rawHorarios: Horario[] = [];
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  franjas: string[] = [];
  schedule: Record<string, Record<string, Horario>> = {};

  usuarioId!: number;
  nombreUsuario = '';
  carreraNombre = '';

  // Control para modal
  showModal = false;
  modalData!: { asignacionId: number; materia: string; profesor: string; fecha: string };

  constructor(private horariosService: HorariosService) {}

  ngOnInit(): void {
    const u = JSON.parse(localStorage.getItem('usuario')!);
    this.usuarioId = u.id;
    this.nombreUsuario = u.nombre;
    this.carreraNombre = `Carrera ID ${u.carrera_id}`;
    this.loadHorarios();
  }

  private loadHorarios(): void {
    this.horariosService.getHorariosPorUsuario(this.usuarioId)
      .subscribe((h: Horario[] | Record<string, Horario[]>) => {
        this.rawHorarios = Array.isArray(h) ? h : (Object.values(h) as Horario[][]).flat();
        this.buildTable();
      });
  }

  private buildTable(): void {
    const horas = new Set<string>();
    this.schedule = {};
    this.rawHorarios.forEach(x => {
      const t = x.hora_inicio.slice(0, 5);
      horas.add(t);
      this.schedule[t] = this.schedule[t] || {};
      this.schedule[t][x.dia_semana] = x;
    });
    this.franjas = Array.from(horas).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  }

  openModal(h: Horario): void {
    this.modalData = {
      asignacionId: h.asignacion_id,
      materia: h.materia_nombre ?? '',
      profesor: h.profesor_nombre ?? '',
      fecha: new Date().toISOString().slice(0, 10)
    };
    this.showModal = true;
  }

  onSave(evt: SaveEvent): void {
    console.log('Guardar:', evt);
    // Aquí integrarías tu servicio para persistir asistencia/tema
    this.showModal = false;
  }

  onCancel(): void {
    this.showModal = false;
  }
}
