import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMateriasComponent } from './modal-materias.component';

describe('ModalMateriasComponent', () => {
  let component: ModalMateriasComponent;
  let fixture: ComponentFixture<ModalMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
