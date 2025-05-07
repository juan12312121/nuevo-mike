import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasVistosComponent } from './temas-vistos.component';

describe('TemasVistosComponent', () => {
  let component: TemasVistosComponent;
  let fixture: ComponentFixture<TemasVistosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemasVistosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasVistosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
