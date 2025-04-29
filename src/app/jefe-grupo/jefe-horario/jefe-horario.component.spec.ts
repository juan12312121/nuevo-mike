import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeHorarioComponent } from './jefe-horario.component';

describe('JefeHorarioComponent', () => {
  let component: JefeHorarioComponent;
  let fixture: ComponentFixture<JefeHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeHorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
