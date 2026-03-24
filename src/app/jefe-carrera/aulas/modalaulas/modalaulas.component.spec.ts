import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalaulasComponent } from './modalaulas.component';

describe('ModalaulasComponent', () => {
  let component: ModalaulasComponent;
  let fixture: ComponentFixture<ModalaulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalaulasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalaulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
