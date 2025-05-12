import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsideProfesoresComponent } from '../../componentes/aside-profesores/aside-profesores.component';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';

interface Horario {
  profesor_id: number;
  grupo: string;
  materia: string;
  profesor: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  duracion_clase: number;
  tiempo_descanso: number | null;
  tipo_duracion: string;
  turno: string;
  aula: string; // Añadimos la propiedad aula
}

interface Alumno {
  matricula: string;
  nombre: string;
  asistencias: number;
  faltas: number;
}

@Component({
  selector: 'app-materias-asignadas-profe',
  standalone: true,
  imports: [CommonModule, AsideProfesoresComponent],
  templateUrl: './materias-asignadas-profe.component.html',
  styleUrls: ['./materias-asignadas-profe.component.css']
})
export class MateriasAsignadasProfeComponent implements OnInit {
  // Propiedades básicas
  horariosProfesores: Horario[] = [];
  gruposUnicos: string[] = [];
  grupoSeleccionado: string = 'all';
  seccionActiva: string = 'courses-section';
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Propiedades para asistencia
  estadoAsistencia: 'pending' | 'registered' = 'pending';
  grupoSeleccionadoLista: string = '';
  alumnosGrupo: Alumno[] = [];
  
  // Propiedades para el calendario
  semanaActual: Date = new Date();

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerHorariosProfesores();
  }

  // Métodos existentes
 // En el método obtenerHorariosProfesores()
obtenerHorariosProfesores(): void {
  const profesorId = this.getProfesorIdDesdeToken();

  if (!profesorId) {
    console.error('❌ No se pudo obtener el ID del profesor desde el token.');
    return;
  }

  this.usuariosService.obtenerHorariosProfesores(profesorId).subscribe({
    next: (res: any) => {
      // Verificar si la respuesta tiene la propiedad horariosProfesores
      if (res && res.horariosProfesores && Array.isArray(res.horariosProfesores)) {
        this.horariosProfesores = res.horariosProfesores;
        this.actualizarGruposUnicos();
        if (this.gruposUnicos.length > 0) {
          this.grupoSeleccionadoLista = this.gruposUnicos[0];
        }
        console.log('✅ Horarios obtenidos:', this.horariosProfesores);
      } else {
        console.warn('⚠️ Formato de respuesta inválido:', res);
      }
    },
    error: (err) => {
      console.error('❌ Error al obtener horarios:', err);
    }
  });
}

  // Métodos para filtrado y formato
  getProfesorIdDesdeToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      return payloadDecoded.id || null;
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }

  actualizarGruposUnicos(): void {
    this.gruposUnicos = [...new Set(this.horariosProfesores.map(h => h.grupo))];
  }

  cambiarGrupo(grupo: string): void {
    this.grupoSeleccionado = grupo;
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  // Métodos para asistencia
  cambiarEstadoAsistencia(estado: 'pending' | 'registered'): void {
    this.estadoAsistencia = estado;
  }

  cambiarGrupoLista(grupo: string): void {
    this.grupoSeleccionadoLista = grupo;
    this.cargarAlumnosGrupo(grupo);
  }

  cargarAlumnosGrupo(grupo: string): void {
    // Aquí implementarías la carga de alumnos desde el servicio
    console.log('Cargando alumnos del grupo:', grupo);
  }

  // Métodos de horarios
  getHorariosPorDia(dia: string): Horario[] {
    return this.horariosProfesores.filter(h => {
      if (this.grupoSeleccionado === 'all') {
        return h.dia_semana === dia;
      }
      return h.dia_semana === dia && h.grupo === this.grupoSeleccionado;
    }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }

  getHorariosPorDiaYEstado(dia: string, estado: string): Horario[] {
    return this.getHorariosPorDia(dia);
    // Aquí implementarías la lógica para filtrar por estado de asistencia
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5);
  }

  // Métodos de exportación e impresión
  exportarHorario(): void {
    console.log('Exportando horario...');
  }

  exportarListas(): void {
    console.log('Exportando listas...');
  }



  // Métodos de asistencia
  registrarAsistencia(horario: Horario): void {
    console.log('Registrando asistencia para:', horario);
  }

  registrarAsistenciaMasiva(): void {
    console.log('Registrando asistencia masiva...');
  }

  // Métodos de navegación del calendario
  semanaAnterior(): void {
    this.semanaActual = new Date(this.semanaActual.setDate(this.semanaActual.getDate() - 7));
  }

  semanaSiguiente(): void {
    this.semanaActual = new Date(this.semanaActual.setDate(this.semanaActual.getDate() + 7));
  }

  obtenerRangoSemana(): string {
    const inicio = new Date(this.semanaActual);
    const fin = new Date(this.semanaActual);
    inicio.setDate(inicio.getDate() - inicio.getDay() + 1);
    fin.setDate(fin.getDate() - fin.getDay() + 5);
    
    return `${inicio.toLocaleDateString()} - ${fin.toLocaleDateString()}`;
  }

  // Métodos de alumnos
  verDetallesAlumno(alumno: Alumno): void {
    console.log('Viendo detalles del alumno:', alumno);
  }
}