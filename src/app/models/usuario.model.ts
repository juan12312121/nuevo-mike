export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  carrera_id?: number | null;
  grupo_id?: number | null;
  escuela_id?: number | null;
  facultad_id?: number | null;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}
