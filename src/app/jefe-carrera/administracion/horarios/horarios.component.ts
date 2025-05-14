// src/app/pages/horarios/horarios.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { Horario, HorariosService } from '../../../core/horarios/horarios.service';

interface Celda {
  hora: string;
  fin: string;
  datosPorDia: { [dia: string]: Horario | null };
}
interface Grupo { id: number; nombre: string; }

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [
    AsideJefecarreraComponent,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  horarios: Horario[] = [];
  private gruposMap = new Map<number, string>();
  private turnosSet = new Set<string>();

  // Ahora pueden ser null hasta que el usuario elija
  selectedGrupo: number | null = null;
  selectedTurno: string | null = null;

  diasSemana = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  franjas: Celda[] = [];

  get gruposList(): Grupo[] {
    return Array.from(this.gruposMap.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a,b) => a.id - b.id);
  }
  get turnosList(): string[] {
    return Array.from(this.turnosSet);
  }

  constructor(
    private router: Router,
    private horariosService: HorariosService
  ) {}

  ngOnInit(): void {
    this.horariosService.getHorariosSQL().subscribe({
      next: lista => {
        this.horarios = lista;
        lista.forEach(h => {
          if (h.grupo_id !== null && h.grupo_nombre) {
            this.gruposMap.set(h.grupo_id, h.grupo_nombre);
          }
          this.turnosSet.add(h.turno);
        });
        // No preseleccionamos nada
      },
      error: err => console.error('Error al cargar horarios:', err)
    });
  }

  irACrearHorario() {
    this.router.navigate(['/crear-horario']);
  }

  onFiltroChange() {
    // Solo construye franjas si ambos están seleccionados
    if (this.selectedGrupo != null && this.selectedTurno) {
      this.construirFranjas();
    } else {
      this.franjas = [];
    }
  }

  private construirFranjas() {
    const filtrados = this.horarios.filter(h =>
      h.grupo_id === this.selectedGrupo && h.turno === this.selectedTurno
    );
    // ... resto igual ...
    const horas = Array.from(new Set(filtrados.map(h => h.hora_inicio)))
                       .sort((a,b) => a.localeCompare(b));
    this.franjas = horas.map(hora => {
      const cualquiera = filtrados.find(h => h.hora_inicio === hora)!;
      const datosPorDia: any = {};
      this.diasSemana.forEach(dia => {
        datosPorDia[dia] = filtrados.find(h => h.hora_inicio === hora && h.dia_semana === dia) || null;
      });
      return { hora, fin: cualquiera.hora_fin, datosPorDia };
    });
  }
}
