import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalJefecarreraComponent } from './modal-jefecarrera.component';

describe('ModalJefecarreraComponent', () => {
  let component: ModalJefecarreraComponent;
  let fixture: ComponentFixture<ModalJefecarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalJefecarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalJefecarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
