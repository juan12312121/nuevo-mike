import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideProfesoresComponent } from "../../componentes/aside-profesores/aside-profesores.component";
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { JustificacionesService } from '../../core/justificaciones/justificaciones.service';


interface Asistencia {
  asistencia_id: number;
  asignacion_id: number;
  profesor_id: number;
  profesor: string;
  materia: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  turno: string;
  aula: string;
  fecha_registro: string;
  estado_asistencia: string;
  tipo_registro: string;
  registrado_por: string;
}

interface Justificacion {
  asistencia_id: number;
  fecha_asistencia: string; // Changed from fecha_registro to fecha_asistencia
  motivo: string;
  archivo_prueba: string;
}

@Component({
  selector: 'app-asistencias-profesor',
  standalone: true,
  imports: [AsideProfesoresComponent, CommonModule,FormsModule],
  templateUrl: './asistencias-profesor.component.html',
  styleUrls: ['./asistencias-profesor.component.css']
})
export class AsistenciasProfesorComponent implements OnInit {
  asistencias: Asistencia[] = [];
  error = '';
  loading = false;
  isModalOpen = false;
  selectedAsistencia: Asistencia | null = null;
  justificacion = { motivo: '', archivo: null as File | null };
   isViewModalOpen = false;
  selectedJustificacion: Justificacion | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private justificacionesService: JustificacionesService
  ) {}

  ngOnInit() {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.loading = true;
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      this.error = 'No ha iniciado sesión.';
      this.loading = false;
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    this.usuariosService.obtenerAsistenciasProfesor(usuario.id).subscribe({
      next: (response: any) => {
        this.asistencias = response.asistencias;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar las asistencias.';
        this.loading = false;
      }
    });
  }

  // Abre el modal y guarda la asistencia seleccionada
  openJustificacionModal(asistencia: Asistencia) {
    this.selectedAsistencia = asistencia;
    this.isModalOpen = true;
    this.justificacion = { motivo: '', archivo: null };
  }

  // Cierra el modal y limpia el estado
  closeJustificacionModal() {
    this.isModalOpen = false;
    this.selectedAsistencia = null;
    this.justificacion = { motivo: '', archivo: null };
  }

  // Captura el archivo subido
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.justificacion.archivo = input.files[0];
    }
  }

  // Valida y envía la justificación al backend
  saveJustificacion() {
    if (!this.selectedAsistencia) return;
    if (!this.justificacion.motivo.trim()) {
      alert('Debe ingresar un motivo.');
      return;
    }

    // Preparamos FormData para incluir archivo
    const form = new FormData();
    form.append('asistencia_id', this.selectedAsistencia.asistencia_id.toString());
    form.append('motivo', this.justificacion.motivo);
    if (this.justificacion.archivo) {
      form.append('archivo_prueba', this.justificacion.archivo, this.justificacion.archivo.name);
    }

    this.justificacionesService.crearJustificacion(form).subscribe({
      next: () => {
        // Actualizamos el estado localmente
        this.asistencias = this.asistencias.map(a =>
          a.asistencia_id === this.selectedAsistencia!.asistencia_id
            ? { ...a, estado_asistencia: 'Justificada' }
            : a
        );
        this.closeJustificacionModal();
      },
      error: err => {
        console.error(err);
        alert('Error al guardar la justificación.');
      }
    });
  }

  // Aquí podrías descargar o mostrar el justificante
 verJustificante(asistenciaId: number) {
    this.justificacionesService.obtenerJustificacionPorAsistencia(asistenciaId).subscribe({
      next: (data) => {
        this.selectedJustificacion = data;
        this.isViewModalOpen = true;
      },
      error: err => {
        console.error(err);
        alert('No se pudo obtener la justificación.');
      }
    });
  }

   closeViewJustificacionModal() {
    this.isViewModalOpen = false;
    this.selectedJustificacion = null;
  }

}
