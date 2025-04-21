import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEscuelasComponent } from './modal-escuelas.component';

describe('ModalEscuelasComponent', () => {
  let component: ModalEscuelasComponent;
  let fixture: ComponentFixture<ModalEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEscuelasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
