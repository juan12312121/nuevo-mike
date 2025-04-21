import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalesMateriasComponent } from './modales-materias.component';

describe('ModalesMateriasComponent', () => {
  let component: ModalesMateriasComponent;
  let fixture: ComponentFixture<ModalesMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalesMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalesMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
