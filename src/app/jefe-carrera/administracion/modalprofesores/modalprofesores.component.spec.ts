import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalprofesoresComponent } from './modalprofesores.component';

describe('ModalprofesoresComponent', () => {
  let component: ModalprofesoresComponent;
  let fixture: ComponentFixture<ModalprofesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalprofesoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalprofesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
