import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  text: string;
  route: string;
  section: string;
}

@Component({
  selector: 'app-aside-profesores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside-profesores.component.html',
  styleUrls: ['./aside-profesores.component.css']
})
export class AsideProfesoresComponent implements OnInit {
  profesorNombre: string = 'Ivar Jose Armenta Lopez';
  profesorRol: string = 'Profesor';
  menuActivo: string = 'courses-section';

  menuItems: MenuItem[] = [
    {
      icon: 'fas fa-book',
      text: 'Materias Asignadas',
      route: '/profes-asignacion',
      section: 'courses-section'
    },
    {
      icon: 'fas fa-user-check',
      text: 'Registrar Asistencia',
      route: '/asistencias-profesorm',
      section: 'attendance-section'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Determinar la sección activa basada en la ruta actual
    const currentRoute = this.router.url;
    const activeItem = this.menuItems.find(item => currentRoute.includes(item.route));
    if (activeItem) {
      this.menuActivo = activeItem.section;
    }
  }

  navegarA(item: MenuItem): void {
    this.menuActivo = item.section;
    this.router.navigate([item.route]);
  }

  cerrarSesion(): void {
    // Limpiar el token y otros datos de sesión
    localStorage.removeItem('token');
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}