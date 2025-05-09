import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideChecadorComponent } from '../componentes/aside-checador/aside-checador.component';
import { GruposService, RawGrupo } from '../core/grupos/grupos.service';
import { DiaHorario, GrupoHorarios, HorarioDetalle, HorariosService } from '../core/horarios/horarios.service';

@Component({
  selector: 'app-checador',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideChecadorComponent],
  templateUrl: './checador.component.html',
  styleUrls: ['./checador.component.css']
})
export class ChecadorComponent implements OnInit {
  currentDateTime: string = '';
  userLogin: string = '';

  gruposCarrera: RawGrupo[] = [];
  horariosPorGrupo: GrupoHorarios[] = [];
  diasConHorarios: DiaHorario[] = [];
  paginadosDias: DiaHorario[] = [];

  selectedGrupoId?: number;
  selectedGrupoNombre = '';
  usuarioId!: number;
  nombreUsuario!: string;
  carreraNombre!: string;

  currentPage = 1;
  itemsPerPage = 1;
  totalPages = 1;

  private readonly diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  constructor(
    private gruposService: GruposService,
    private horariosService: HorariosService
  ) {}

  ngOnInit(): void {
    this.extraerUsuarioDelToken();
    this.userLogin = this.nombreUsuario;
    this.initCurrentDateTime();
    this.loadGrupos();
    this.loadHorarios();
  }

  private initCurrentDateTime(): void {
    const update = () => {
      const now = new Date();
      this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    };
    update();
    setInterval(update, 60000);
  }

  private extraerUsuarioDelToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.usuarioId = payload.id || payload.user_id || payload.sub;
      this.nombreUsuario = payload.nombre || payload.name || 'Usuario';
      this.carreraNombre = payload.carrera_nombre || `Carrera ID ${payload.carrera_id}`;
    } catch {
      console.warn('Token inválido o malformado');
    }
  }

  private loadGrupos(): void {
    this.gruposService.getGruposPorUsuario(this.usuarioId).subscribe({
      next: (g) => this.gruposCarrera = g,
      error: (err) => console.error('Error al cargar grupos:', err)
    });
  }

  private loadHorarios(): void {
    this.horariosService.getHorariosPorChecador(this.usuarioId).subscribe({
      next: (grs) => {
        this.horariosPorGrupo = grs;
      },
      error: (err) => console.error('Error al cargar horarios:', err)
    });
  }

  onGrupoSeleccionado(): void {
    if (!this.selectedGrupoId) {
      this.resetearDatos();
      return;
    }

    const grupoSeleccionado = this.horariosPorGrupo.find(x => x.grupo_id === this.selectedGrupoId);
    const grupoNombre = this.gruposCarrera.find(g => g.grupo_id === this.selectedGrupoId)?.grupo_nombre;

    this.selectedGrupoNombre = grupoNombre ?? 'Grupo desconocido';

    if (!grupoSeleccionado || !grupoSeleccionado.horarios) {
      this.resetearDatos();
      return;
    }

    this.diasConHorarios = grupoSeleccionado.horarios.sort((a, b) => {
      const ordenA = a.horarios_del_dia[0]?.orden_dia || 0;
      const ordenB = b.horarios_del_dia[0]?.orden_dia || 0;
      return ordenA - ordenB;
    });

    this.totalPages = Math.max(1, this.diasConHorarios.length);
    this.currentPage = 1;
    this.cargarPagina();
  }

  private resetearDatos(): void {
    this.diasConHorarios = [];
    this.paginadosDias = [];
    this.selectedGrupoNombre = '';
    this.totalPages = 1;
    this.currentPage = 1;
  }

  cargarPagina(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginadosDias = this.diasConHorarios.slice(startIndex, endIndex);
  }

  irPaginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarPagina();
    }
  }

  irPaginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarPagina();
    }
  }

  hasHorarios(): boolean {
    return this.paginadosDias.length > 0;
  }

  getDiaSemana(orden_dia: number): string {
    return this.diasOrdenados[orden_dia - 1] || 'Día no especificado';
  }

  isCurrentHorario(horario: HorarioDetalle): boolean {
    const now = new Date(this.currentDateTime);
    const horaInicio = new Date(now.toDateString() + ' ' + horario.hora_inicio);
    const horaFin = new Date(now.toDateString() + ' ' + horario.hora_fin);
    return now >= horaInicio && now <= horaFin;
  }

  getClaseMateria(horario: HorarioDetalle): string {
    return horario.materia ? horario.materia.slice(0, 5).toLowerCase() : '';
  }
}
