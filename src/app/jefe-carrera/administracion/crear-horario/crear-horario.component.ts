import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { AulasService } from '../../../core/aulas/aulas.service';
import { GruposService } from '../../../core/grupos/grupos.service';

@Component({   
  selector: 'app-crear-horario',   
  standalone: true,   
  imports: [CommonModule, FormsModule, AsideJefecarreraComponent],   
  templateUrl: './crear-horario.component.html',   
  styleUrls: ['./crear-horario.component.css'] 
}) 
export class CrearHorarioComponent implements OnInit {   
  // El tab activo por defecto   
  currentTab: 'formato' | 'dias' | 'diseno' = 'formato';

  // Listas de datos
  aulas: any[] = [];
  grupos: any[] = [];

  // Bindings para ngModel
  selectedGrupoId: number | null = null;
  selectedAulaId: number | null = null;

  constructor(
    private aulasService: AulasService,
    private gruposService: GruposService
  ) {}
  
  ngOnInit() {
    console.log('Componente inicializado');
    console.log('Tab inicial:', this.currentTab);
    
    // Cargar datos
    this.obtenerAulas();
    this.obtenerGrupos();
  }
      
  // Función para cambiar de tab   
  selectTab(tab: 'formato' | 'dias' | 'diseno'): void {     
    console.log('selectTab llamado con parámetro:', tab);     
    console.log('Tab anterior:', this.currentTab);
    this.currentTab = tab;     
    console.log('Tab nuevo:', this.currentTab);
  }
      
  // Función para navegación con los botones anterior/siguiente   
  navegarTab(direccion: 'anterior' | 'siguiente'): void {     
    console.log('navegarTab llamado con dirección:', direccion);     
    console.log('Tab actual antes de navegar:', this.currentTab);          
    
    if (direccion === 'anterior') {       
      if (this.currentTab === 'dias') this.currentTab = 'formato';       
      else if (this.currentTab === 'diseno') this.currentTab = 'dias';     
    } else {       
      if (this.currentTab === 'formato') this.currentTab = 'dias';       
      else if (this.currentTab === 'dias') this.currentTab = 'diseno';     
    }
    console.log('Tab cambiado a', this.currentTab);
  }

  // Cargar aulas desde el servidor
  private obtenerAulas(): void {
    this.aulasService.obtenerAulas().subscribe({
      next: raw => {
        console.log('Raw aulas:', raw);
        if (Array.isArray(raw)) {
          this.aulas = raw;
        } else if (Array.isArray((raw as any).data)) {
          this.aulas = (raw as any).data;
        } else if (Array.isArray((raw as any).aulas)) {
          this.aulas = (raw as any).aulas;
        } else {
          console.error('Formato inesperado de aulas:', raw);
          this.aulas = [];
        }
        console.log('Aulas cargadas:', this.aulas);
      },
      error: err => console.error('Error al obtener aulas:', err)
    });
  }

  // Cargar grupos desde el servidor
  private obtenerGrupos(): void {
    this.gruposService.getGrupos().subscribe({
      next: raw => {
        console.log('Raw grupos:', raw);
        if (Array.isArray(raw)) {
          this.grupos = raw;
        } else if (Array.isArray((raw as any).data)) {
          this.grupos = (raw as any).data;
        } else if (Array.isArray((raw as any).grupos)) {
          this.grupos = (raw as any).grupos;
        } else {
          console.error('Formato inesperado de grupos:', raw);
          this.grupos = [];
        }
        console.log('Grupos cargados:', this.grupos);
      },
      error: err => console.error('Error al obtener grupos:', err)
    });
  }

  // Método para verificar el estado general
  checkStatus(): void {
    console.log('--- Estado actual del componente ---');
    console.log('currentTab:', this.currentTab);
    console.log('Aulas disponibles:', this.aulas.length);
    console.log('Grupos disponibles:', this.grupos.length);
    console.log('Grupo seleccionado:', this.selectedGrupoId);
    console.log('Aula seleccionada:', this.selectedAulaId);
    console.log('--------------------------------');
  }
}
