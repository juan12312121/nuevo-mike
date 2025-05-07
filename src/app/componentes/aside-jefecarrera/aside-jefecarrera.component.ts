// src/app/componentes/aside-jefecarrera/aside-jefecarrera.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside-jefecarrera',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside-jefecarrera.component.html',
  styleUrls: ['./aside-jefecarrera.component.css']
})
export class AsideJefecarreraComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Inyecta Font Awesome si no lo has hecho en index.html
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(
      link,
      'href',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    );
    this.renderer.appendChild(document.head, link);
  }

  logout(): void {
    console.log('Cerrando sesión y eliminando token y usuario de localStorage');
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    if (token) { console.log('Token encontrado:', token); }
    if (usuario) { console.log('Usuario encontrado:', usuario); }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    console.log('Sesión cerrada');
    // Aquí podrías redirigir a /login por ejemplo
    // this.router.navigate(['/login']);
  }
}
