import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";

@Component({   
  selector: 'app-crear-horario',   
  standalone: true,   
  imports: [AsideJefecarreraComponent, CommonModule],   
  templateUrl: './crear-horario.component.html',   
  styleUrls: ['./crear-horario.component.css'] 
}) 
export class CrearHorarioComponent implements OnInit {   
  // El tab activo por defecto   
  currentTab: 'formato' | 'dias' | 'diseno' = 'formato';
  
  ngOnInit() {
    console.log('Componente inicializado');
    console.log('Tab inicial:', this.currentTab);
    
    // Verifica el DOM después de la inicialización
    setTimeout(() => {
      console.log('Verificando estado del DOM después de la inicialización:');
      const formatoTab = document.getElementById('formato');
      console.log('Tab formato existe en el DOM:', !!formatoTab);
      console.log('Tab formato es visible:', formatoTab?.style.display !== 'none');
    }, 500);
  }
      
  // Función para cambiar de tab   
  selectTab(tab: 'formato' | 'dias' | 'diseno'): void {     
    console.log('selectTab llamado con parámetro:', tab);     
    console.log('Tab anterior:', this.currentTab);
    this.currentTab = tab;     
    console.log('Tab nuevo:', this.currentTab);
    
    // Verifica el DOM después del cambio
    setTimeout(() => {
      console.log(`Verificando visibilidad del tab ${tab}:`);
      const tabElement = document.getElementById(tab);
      console.log(`Tab ${tab} existe en el DOM:`, !!tabElement);
      console.log(`Tab ${tab} es visible:`, tabElement?.style.display !== 'none');
      
      // Verificar si el ngIf está funcionando
      const tabs = ['formato', 'dias', 'diseno'];
      tabs.forEach(t => {
        const el = document.getElementById(t);
        console.log(`Tab ${t} presente en el DOM:`, !!el);
      });
    }, 100);
  }
      
  // Función para navegación con los botones anterior/siguiente   
  navegarTab(direccion: 'anterior' | 'siguiente'): void {     
    console.log('navegarTab llamado con dirección:', direccion);     
    console.log('Tab actual antes de navegar:', this.currentTab);          
    
    const tabAnterior = this.currentTab;
    
    if (direccion === 'anterior') {       
      if (this.currentTab === 'dias') this.currentTab = 'formato';       
      else if (this.currentTab === 'diseno') this.currentTab = 'dias';     
    } else {       
      if (this.currentTab === 'formato') this.currentTab = 'dias';       
      else if (this.currentTab === 'dias') this.currentTab = 'diseno';     
    }
    
    console.log('Tab cambiado de', tabAnterior, 'a', this.currentTab);
    
    // Verificar si el cambio se refleja en la UI
    setTimeout(() => {
      console.log('Verificación después de navegarTab:');
      console.log('currentTab en el modelo:', this.currentTab);
      const tabActivo = document.querySelector('.tab-content:not([style*="display: none"])');
      console.log('Tab actualmente visible en el DOM:', tabActivo?.id || 'ninguno');
    }, 100);
  }

  // Método para verificar el estado general
  checkStatus(): void {
    console.log('--- Estado actual del componente ---');
    console.log('currentTab:', this.currentTab);
    console.log('Tab formato visible:', document.getElementById('formato')?.offsetParent !== null);
    console.log('Tab dias visible:', document.getElementById('dias')?.offsetParent !== null);
    console.log('Tab diseno visible:', document.getElementById('diseno')?.offsetParent !== null);
    console.log('--------------------------------');
  }
}