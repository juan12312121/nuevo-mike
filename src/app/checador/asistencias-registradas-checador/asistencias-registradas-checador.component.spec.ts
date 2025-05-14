import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasRegistradasChecadorComponent } from './asistencias-registradas-checador.component';

describe('AsistenciasRegistradasChecadorComponent', () => {
  let component: AsistenciasRegistradasChecadorComponent;
  let fixture: ComponentFixture<AsistenciasRegistradasChecadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasRegistradasChecadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciasRegistradasChecadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
