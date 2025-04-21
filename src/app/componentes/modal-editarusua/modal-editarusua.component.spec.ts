import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarusuaComponent } from './modal-editarusua.component';

describe('ModalEditarusuaComponent', () => {
  let component: ModalEditarusuaComponent;
  let fixture: ComponentFixture<ModalEditarusuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarusuaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarusuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
