import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab3.component.html',
  styleUrl: './tab3.component.css'
})
export class Tab3Component {

   @Input() currentTab: 'formato' | 'dias' | 'diseno' = 'formato';
    @Output() tabChange = new EventEmitter<'formato' | 'dias' | 'diseno'>();

  navegarTab(dir: 'anterior' | 'siguiente') {
    const next = dir === 'anterior'
      ? (this.currentTab === 'dias' ? 'formato' : 'dias')
      : (this.currentTab === 'formato' ? 'dias' : 'diseno');
    this.tabChange.emit(next);
  }


}
