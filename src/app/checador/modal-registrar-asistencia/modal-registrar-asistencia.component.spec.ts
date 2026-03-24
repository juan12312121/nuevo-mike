import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistrarAsistenciaComponent } from './modal-registrar-asistencia.component';

describe('ModalRegistrarAsistenciaComponent', () => {
  let component: ModalRegistrarAsistenciaComponent;
  let fixture: ComponentFixture<ModalRegistrarAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegistrarAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRegistrarAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
