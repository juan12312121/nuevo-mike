import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideChecadorComponent } from './aside-checador.component';

describe('AsideChecadorComponent', () => {
  let component: AsideChecadorComponent;
  let fixture: ComponentFixture<AsideChecadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideChecadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideChecadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
