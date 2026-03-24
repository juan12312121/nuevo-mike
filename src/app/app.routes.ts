import { Routes } from '@angular/router';
import { CarrerasComponent } from './administrador/carreras/carreras.component';
import { EscuelasComponent } from './administrador/escuelas/escuelas.component';
import { FacultadesComponent } from './administrador/facultades/facultades.component';
import { JefesDeCarreraComponent } from './administrador/jefes-de-carrera/jefes-de-carrera.component';
import { PrincipalAdministradorComponent } from './administrador/principal-administrador/principal-administrador.component';
import { LoginComponent } from './autenticacion/login/login.component';
import { AsistenciasRegistradasChecadorComponent } from './checador/asistencias-registradas-checador/asistencias-registradas-checador.component';
import { ChecadorComponent } from './checador/checador.component';
import { CrearHorarioComponent } from './jefe-carrera/administracion/crear-horario/crear-horario.component';
import { GruposComponent } from './jefe-carrera/administracion/grupos/grupos.component';
import { HorariosComponent } from './jefe-carrera/administracion/horarios/horarios.component';
import { MateriasComponent } from './jefe-carrera/administracion/materias/materias.component';
import { ProfesoresComponent } from './jefe-carrera/administracion/profesores/profesores.component';
import { ChecadoresComponent } from './jefe-carrera/administracion/checadores/checadores.component';
import { JefesGrupoComponent } from './jefe-carrera/administracion/jefes-grupo/jefes-grupo.component';
import { AsignacionesComponent } from './jefe-carrera/administracion/asignaciones/asignaciones.component';
import { AulasComponent } from './jefe-carrera/aulas/aulas.component';
import { PrincipalComponent } from './jefe-carrera/principal/principal.component';
import { TemasVistosComponent } from './jefe-carrera/temas-vistos/temas-vistos.component';
import { AsistenciaRegistradasComponent } from './jefe-grupo/asistencia-registradas/asistencia-registradas.component';
import { JefeHorarioComponent } from './jefe-grupo/jefe-horario/jefe-horario.component';
import { TemasRegistradosComponent } from './jefe-grupo/temas-registrados/temas-registrados.component';
import { AsistenciasProfesorComponent } from './profesores/asistencias-profesor/asistencias-profesor.component';
import { MateriasAsignadasProfeComponent } from './profesores/materias-asignadas-profe/materias-asignadas-profe.component';
import { UsuariosAdminComponent } from './super-admin/usuarios-admin/usuarios-admin.component';
import { PrincipalSuperAdminComponent } from './super-admin/principal-super-admin/principal-super-admin.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // <-- Ruta base
  { path: 'login', component: LoginComponent },

  { path: 'jefe-carrera', component: PrincipalComponent },
  { path: 'checadores', component: ChecadoresComponent },
  { path: 'jefes-grupo', component: JefesGrupoComponent },
  {path:'profes', component:ProfesoresComponent},
  {path:'materias',component:MateriasComponent},
  {path:'grupos',component:GruposComponent},
  {path:'carreras',component:CarrerasComponent},
  {path:'aulas', component:AulasComponent},
  {path:'horarios',component:HorariosComponent},
  {path:'asignaciones', component: AsignacionesComponent},
  {path:'crear-horario',component:CrearHorarioComponent},
  {path:'temas-vistos',component:TemasVistosComponent},

  {path:'administrador',component:PrincipalAdministradorComponent},
  {path:'escuelas',component:EscuelasComponent},
  {path:'facultades',component:FacultadesComponent},
  {path:'jefe-de-carrera',component:JefesDeCarreraComponent},

  {path:'jefe-grupo',component:JefeHorarioComponent},
  {path:'mis-asistencias',component:AsistenciaRegistradasComponent},
  {path:'temas-vistos2',component:TemasRegistradosComponent},

  {path:'profes-asignacion',component:MateriasAsignadasProfeComponent},
  {path:'asistencias-profesorm',component:AsistenciasProfesorComponent},

  {path:'checador',component:ChecadorComponent},
  {path:'checador-asistencias',component:AsistenciasRegistradasChecadorComponent},

  // Rutas de Super Administrador (Serán protegidas por guardias luego)
  {path:'super-admin', component: PrincipalSuperAdminComponent},
  {path:'super-admin/escuelas', component: EscuelasComponent},
  {path:'super-admin/admins', component: UsuariosAdminComponent}
];
