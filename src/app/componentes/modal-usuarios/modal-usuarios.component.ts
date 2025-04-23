// modal-usuarios.component.ts
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { CarrerasService } from '../../core/carreras/carreras.service';
import { Grupo, GruposService, RawGrupo } from '../../core/grupos/grupos.service';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.css']
})
export class ModalUsuariosComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() tipo: 'checador' | 'jefe' | null = null;
  @Input() usuarioId: number | null = null;
  @Output() modalClose = new EventEmitter<void>();
  @Output() usuarioGuardado = new EventEmitter<any>();

  carreras: any[] = [];
  grupos: Grupo[] = [];
  usuario: any = {};

  loadingCarreras = false;
  errorCarreras: string | null = null;

  loadingGrupos = false;
  errorGrupos: string | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private carrerasService: CarrerasService,
    private gruposService: GruposService
  ) {}

  ngOnInit() {
    this.obtenerCarreras();
    if (this.tipo === 'jefe' && this.visible) this.obtenerGrupos();
    if (this.usuarioId) this.obtenerUsuarioPorId(this.usuarioId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['visible']?.currentValue === true) || changes['tipo']) {
      if (this.tipo === 'jefe' && this.visible) this.obtenerGrupos();
      if (this.usuarioId) this.obtenerUsuarioPorId(this.usuarioId);
    }
  }

  private obtenerCarreras() {
    this.loadingCarreras = true;
    this.errorCarreras = null;
    this.carrerasService.obtenerCarreras().subscribe({
      next: data => {
        this.loadingCarreras = false;
        if (Array.isArray(data)) this.carreras = data;
        else this.errorCarreras = 'Respuesta inválida del servidor';
      },
      error: (err: HttpErrorResponse) => {
        this.loadingCarreras = false;
        this.errorCarreras = 'No se pudieron cargar las carreras';
      }
    });
  }

  private obtenerGrupos() {
    this.loadingGrupos = true;
    this.errorGrupos = null;
    this.gruposService.getGrupos().subscribe({
      next: (data: RawGrupo[]) => {
        this.loadingGrupos = false;
        this.grupos = data.map(g => ({
          id: g.id,
          nombre: g.grupo_nombre,
          carrera_nombre: g.carrera_nombre,
          semestre: g.semestre
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.loadingGrupos = false;
        this.errorGrupos = 'No fue posible cargar los grupos';
      }
    });
  }

  private obtenerUsuarioPorId(id: number) {
    this.usuariosService.obtenerUsuarioPorId(id).subscribe({
      next: res => this.usuario = res.usuario,
      error: (err: HttpErrorResponse) => console.error(err)
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const payload = {
      ...form.value,
      rol_id: this.tipo === 'checador' ? 2 : 3,
      grupo_id: this.tipo === 'jefe' ? form.value.grupo_id : null
    };

    if (this.usuarioId) {
      this.usuariosService.actualizarUsuario(this.usuarioId, payload)
        .subscribe({
          next: res => {
            this.usuarioGuardado.emit(res);
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => console.error(err)
        });
    } else {
      this.usuariosService.registrarChecadorYJefe(payload)
        .subscribe({
          next: res => {
            this.usuarioGuardado.emit(res);
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => console.error(err)
        });
    }
  }

  closeModal() {
    this.modalClose.emit();
  }
}
