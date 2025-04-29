import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasRegistradosComponent } from './temas-registrados.component';

describe('TemasRegistradosComponent', () => {
  let component: TemasRegistradosComponent;
  let fixture: ComponentFixture<TemasRegistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemasRegistradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
