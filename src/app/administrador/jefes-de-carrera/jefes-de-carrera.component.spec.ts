import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefesDeCarreraComponent } from './jefes-de-carrera.component';

describe('JefesDeCarreraComponent', () => {
  let component: JefesDeCarreraComponent;
  let fixture: ComponentFixture<JefesDeCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefesDeCarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefesDeCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
