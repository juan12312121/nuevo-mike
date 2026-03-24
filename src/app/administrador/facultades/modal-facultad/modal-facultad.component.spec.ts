import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFacultadComponent } from './modal-facultad.component';

describe('ModalFacultadComponent', () => {
  let component: ModalFacultadComponent;
  let fixture: ComponentFixture<ModalFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFacultadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
