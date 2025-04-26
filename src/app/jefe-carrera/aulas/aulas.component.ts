// src/app/aulas/aulas.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalaulasComponent } from "../../componentes/modalaulas/modalaulas.component";
import { AulasService } from '../../core/aulas/aulas.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [
    AsideJefecarreraComponent,
    CommonModule,
    FormsModule,
    ModalaulasComponent
  ],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: any[] = [];
  filteredAulas: any[] = [];
  searchQuery = '';
  errorMessage = '';
  showModal = false;  // controla visibilidad del modal

  constructor(private aulasService: AulasService) {}

  ngOnInit(): void {
    this.obtenerAulas();
  }

  obtenerAulas(): void {
    this.aulasService.obtenerAulas().subscribe({
      next: (resp: any) => {
        // Si tu API devuelve { success, data }
        this.aulas = resp.data ?? resp;
        this.filteredAulas = [...this.aulas];
      },
      error: err => {
        console.error('Error al obtener aulas:', err);
        this.errorMessage = 'Hubo un error al cargar las aulas';
      }
    });
  }

  buscarAulas(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredAulas = [...this.aulas];
    } else {
      this.filteredAulas = this.aulas.filter(a =>
        a.id.toString().includes(q) ||
        a.nombre.toLowerCase().includes(q)
      );
    }
  }

  abrirModal(): void {
    this.showModal = true;
  }

  onModalChange(open: boolean): void {
    this.showModal = open;
  }

  onAulaCreada(aula: any): void {
    this.aulas.push(aula);
    this.filteredAulas.push(aula);
  }

  eliminarAula(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta aula?')) return;
    this.aulasService.eliminarAula(id).subscribe({
      next: () => {
        this.aulas = this.aulas.filter(a => a.id !== id);
        this.filteredAulas = this.filteredAulas.filter(a => a.id !== id);
        alert('Aula eliminada correctamente');
      },
      error: err => {
        console.error('Error al eliminar aula:', err);
        alert('No se pudo eliminar el aula');
      }
    });
  }
}
