import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgreusuaComponent } from './modal-agreusua.component';

describe('ModalAgreusuaComponent', () => {
  let component: ModalAgreusuaComponent;
  let fixture: ComponentFixture<ModalAgreusuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgreusuaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgreusuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
