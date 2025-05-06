import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  usuario: any;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = 'http://localhost:4000/api/usuarios';

  constructor(private http: HttpClient) { }

  login(credentials: { correo: string; contrasena: string }): Observable<LoginResponse> {
    console.log('Iniciando proceso de login con las credenciales:', credentials);
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta recibida del login:', res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
          },
          error: (err) => {
            console.error('Error en el proceso de login:', err);
          }
        })
      );
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Obteniendo token:', token);
    return token;
  }

  logout(): void {
    console.log('Cerrando sesión y eliminando token y usuario de localStorage');
    if (localStorage.getItem('token')) {
      console.log('Token encontrado:', localStorage.getItem('token'));
    }
    if (localStorage.getItem('usuario')) {
      console.log('Usuario encontrado:', localStorage.getItem('usuario'));
    }
    
    // Eliminar los datos
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    console.log('Sesión cerrada');
  }
  

  // Nueva función para obtener jefes de carrera (rol_id = 4)
  obtenerJefesDeCarrera(): Observable<any> {
    console.log('Solicitando lista de jefes de carrera...');
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/jefes`, { headers })
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta de la solicitud de jefes de carrera:', res);
          },
          error: (err) => {
            console.error('Error al obtener los jefes de carrera:', err);
          }
        })
      );
  }

  // Nueva función para registrar un Jefe de Carrera
  registrarJefeDeCarrera(usuario: { nombre: string; correo: string; contrasena: string; carrera_id: number }): Observable<any> {
    console.log('Registrando Jefe de Carrera:', usuario);
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Asignar rol_id = 4 para Jefe de Carrera
    const usuarioConRol = { ...usuario, rol_id: 4 };

    return this.http.post(`${this.baseUrl}/crear`, usuarioConRol, { headers })
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta de la solicitud de registro de Jefe de Carrera:', res);
          },
          error: (err) => {
            console.error('Error al registrar el Jefe de Carrera:', err);
          }
        })
      );
  }

  actualizarUsuario(id: number, datosActualizados: { 
    nombre?: string; 
    correo?: string; 
    contrasena?: string; 
    rol_id?: number; 
    carrera_id?: number; 
    grupo_id?: number;  // Asegurando que el grupo_id sea parte de los datos
  }): Observable<any> {
    console.log('Actualizando usuario con ID:', id);
    console.log('Datos enviados para actualización:', datosActualizados);
  
    // Obtener el token desde el localStorage
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }
  
    // Configurar los encabezados para la autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    // Verificar si el grupo_id está presente
    if (datosActualizados.grupo_id) {
      console.log('Grupo a actualizar:', datosActualizados.grupo_id);
    }
  
    // Enviar los datos a través de la petición PUT
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, datosActualizados, { headers })
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta de actualización del usuario:', res);
          },
          error: (err) => {
            console.error('Error al actualizar el usuario:', err);
          }
        })
      );
  }
  

  obtenerUsuarioPorId(id: number): Observable<any> {
    console.log(`Solicitando datos del usuario con ID: ${id}`);
  
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.baseUrl}/${id}`, { headers })
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta de la solicitud de usuario por ID:', res);
          },
          error: (err) => {
            console.error('Error al obtener el usuario por ID:', err);
          }
        })
      );
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.delete(`${this.baseUrl}/eliminar/${id}`, { headers }).pipe(
      tap({
        next: (res) => console.log('Respuesta al eliminar usuario:', res),
        error: (err) => console.error('Error en eliminarUsuario:', err)
      })
    );
  }
  
  obtenerUsuariosNivelPermitido(): Observable<{ usuarios: any[] }> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    console.log('Solicitando usuarios con rol_id permitido');
    return this.http
      .get<{ usuarios: any[] }>(`${this.baseUrl}/listar`, { headers })
      .pipe(
        tap({
          next: (res) =>
            console.log('Usuarios recibidos:', res.usuarios),
          error: (err) =>
            console.error('Error al obtener usuarios:', err)
        })
      );
  }
  

  registrarChecadorYJefe(usuario: { 
    nombre: string; 
    correo: string; 
    contrasena: string; 
    carrera_id: number; 
    rol_id: number; 
    grupo_id?: number; // ← añade este campo opcional
  }): Observable<any> {
    console.log('Registrando Jefe de Carrera o Checador:', usuario);
  
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.baseUrl}/crear-checador-jefe`, usuario, { headers }).pipe(
      tap({
        next: (res) => {
          console.log('Respuesta del backend:', res);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
        }
      })
    );
  }
  

  registrarProfesor(usuario: { nombre: string; correo: string; contrasena: string }): Observable<any> {
    console.log('Registrando Profesor:', usuario);
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Enviamos solo nombre, correo y contrasena; el backend asigna rol_id = 1
    return this.http.post(`${this.baseUrl}/crear-profesor`, usuario, { headers })
      .pipe(
        tap({
          next: (res) => {
            console.log('Respuesta de registro de Profesor:', res);
          },
          error: (err) => {
            console.error('Error al registrar el Profesor:', err);
          }
        })
      );
  }




  listarProfesores(): Observable<{ profesores: any[] }> {
    console.log('Solicitando lista de profesores...');
    const token = this.getToken();
    if (!token) {
      console.warn('No se encontró token en localStorage');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http
      .get<{ profesores: any[] }>(`${this.baseUrl}/listar-profesores`, { headers })
      .pipe(
        tap({
          next: (res) => console.log('Profesores recibidos:', res.profesores),
          error: (err) => console.error('Error al listar profesores:', err)
        })
      );
  }
  

  actualizarProfesor(
    id: number,
    datos: {
      nombre?: string;
      correo?: string;
      contrasena?: string;
    }
  ): Observable<any> {
    console.log('Actualizando profesor ID:', id, 'con datos:', datos);

    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put(`${this.baseUrl}/actualizar-profesor/${id}`, datos, { headers })
      .pipe(
        tap({
          next: (res) => console.log('Profesor actualizado:', res),
          error: (err) => console.error('Error al actualizar profesor:', err),
        })
      );
  }

}
