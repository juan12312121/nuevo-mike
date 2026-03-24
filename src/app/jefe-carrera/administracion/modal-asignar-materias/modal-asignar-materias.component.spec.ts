import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarMateriasComponent } from './modal-asignar-materias.component';

describe('ModalAsignarMateriasComponent', () => {
  let component: ModalAsignarMateriasComponent;
  let fixture: ComponentFixture<ModalAsignarMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsignarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
