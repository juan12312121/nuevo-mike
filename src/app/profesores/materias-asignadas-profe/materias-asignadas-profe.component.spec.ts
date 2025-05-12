import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasAsignadasProfeComponent } from './materias-asignadas-profe.component';

describe('MateriasAsignadasProfeComponent', () => {
  let component: MateriasAsignadasProfeComponent;
  let fixture: ComponentFixture<MateriasAsignadasProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasAsignadasProfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriasAsignadasProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
