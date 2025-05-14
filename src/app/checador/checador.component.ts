import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideChecadorComponent } from '../componentes/aside-checador/aside-checador.component';

@Component({
  selector: 'app-checador',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideChecadorComponent],
  templateUrl: './checador.component.html',
  styleUrls: ['./checador.component.css']
})
export class ChecadorComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
