import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasProfesorComponent } from './asistencias-profesor.component';

describe('AsistenciasProfesorComponent', () => {
  let component: AsistenciasProfesorComponent;
  let fixture: ComponentFixture<AsistenciasProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciasProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
