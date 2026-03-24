export interface Grupo {
  id: number;
  nombre: string;
  carrera_id: number;
  carrera_nombre?: string;
  semestre: string;
}

export interface RawGrupo {
  carrera: any;
  nombre: any;
  id: number;
  grupo_id: number;
  grupo_nombre: string;
  carrera_nombre: string;
  semestre: string;
}

export interface RawGrupoApi {
  grupo_id: number;
  grupo_nombre: string;
  carrera_nombre: string;
  grupo_semestre: string;
}
