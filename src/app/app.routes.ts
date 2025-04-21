import { Routes } from '@angular/router';
import { CarrerasComponent } from './administrador/carreras/carreras.component';
import { EscuelasComponent } from './administrador/escuelas/escuelas.component';
import { FacultadesComponent } from './administrador/facultades/facultades.component';
import { JefesDeCarreraComponent } from './administrador/jefes-de-carrera/jefes-de-carrera.component';
import { PrincipalAdministradorComponent } from './administrador/principal-administrador/principal-administrador.component';
import { LoginComponent } from './autenticacion/login/login.component';
import { GruposComponent } from './jefe-carrera/administracion/grupos/grupos.component';
import { MateriasComponent } from './jefe-carrera/administracion/materias/materias.component';
import { ProfesoresComponent } from './jefe-carrera/administracion/profesores/profesores.component';
import { UsuariosComponent } from './jefe-carrera/administracion/usuarios/usuarios.component';
import { PrincipalComponent } from './jefe-carrera/principal/principal.component';
import { RegistroAsistenciaComponent } from './jefe-carrera/registro-asistencia/registro-asistencia.component';

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

  {path:'administrador',component:PrincipalAdministradorComponent},
  {path:'escuelas',component:EscuelasComponent},
  {path:'facultades',component:FacultadesComponent},
  {path:'jefe-de-carrera',component:JefesDeCarreraComponent}
];
