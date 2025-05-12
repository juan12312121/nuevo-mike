import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideProfesoresComponent } from './aside-profesores.component';

describe('AsideProfesoresComponent', () => {
  let component: AsideProfesoresComponent;
  let fixture: ComponentFixture<AsideProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideProfesoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
