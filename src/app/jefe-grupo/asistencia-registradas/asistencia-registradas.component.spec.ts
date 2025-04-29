import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaRegistradasComponent } from './asistencia-registradas.component';

describe('AsistenciaRegistradasComponent', () => {
  let component: AsistenciaRegistradasComponent;
  let fixture: ComponentFixture<AsistenciaRegistradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaRegistradasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaRegistradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
