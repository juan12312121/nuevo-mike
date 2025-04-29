import { Routes } from '@angular/router';
import { CarrerasComponent } from './administrador/carreras/carreras.component';
import { EscuelasComponent } from './administrador/escuelas/escuelas.component';
import { FacultadesComponent } from './administrador/facultades/facultades.component';
import { JefesDeCarreraComponent } from './administrador/jefes-de-carrera/jefes-de-carrera.component';
import { PrincipalAdministradorComponent } from './administrador/principal-administrador/principal-administrador.component';
import { LoginComponent } from './autenticacion/login/login.component';
import { CrearHorarioComponent } from './jefe-carrera/administracion/crear-horario/crear-horario.component';
import { GruposComponent } from './jefe-carrera/administracion/grupos/grupos.component';
import { HorariosComponent } from './jefe-carrera/administracion/horarios/horarios.component';
import { MateriasComponent } from './jefe-carrera/administracion/materias/materias.component';
import { ProfesoresComponent } from './jefe-carrera/administracion/profesores/profesores.component';
import { UsuariosComponent } from './jefe-carrera/administracion/usuarios/usuarios.component';
import { AulasComponent } from './jefe-carrera/aulas/aulas.component';
import { PrincipalComponent } from './jefe-carrera/principal/principal.component';
import { RegistroAsistenciaComponent } from './jefe-carrera/registro-asistencia/registro-asistencia.component';
import { JefeHorarioComponent } from './jefe-grupo/jefe-horario/jefe-horario.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // <-- Ruta base
  { path: 'login', component: LoginComponent },

  { path: 'jefe-carrera', component: PrincipalComponent },
  {path: 'registro-asistencia', component:RegistroAsistenciaComponent},
  {path: 'usuarios', component:UsuariosComponent},
  {path:'profes', component:ProfesoresComponent},
  {path:'materias',component:MateriasComponent},
  {path:'grupos',component:GruposComponent},
  {path:'carreras',component:CarrerasComponent},
  {path:'aulas', component:AulasComponent},
  {path:'horarios',component:HorariosComponent},
  {path:'crear-horario',component:CrearHorarioComponent},

  {path:'administrador',component:PrincipalAdministradorComponent},
  {path:'escuelas',component:EscuelasComponent},
  {path:'facultades',component:FacultadesComponent},
  {path:'jefe-de-carrera',component:JefesDeCarreraComponent},

  {path:'jefe-grupo',component:JefeHorarioComponent}
];
