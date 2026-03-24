import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistrarTemaAsistenciaComponent } from './modal-registrar-tema-asistencia.component';

describe('ModalRegistrarTemaAsistenciaComponent', () => {
  let component: ModalRegistrarTemaAsistenciaComponent;
  let fixture: ComponentFixture<ModalRegistrarTemaAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegistrarTemaAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRegistrarTemaAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
