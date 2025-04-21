import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideJefecarreraComponent } from './aside-jefecarrera.component';

describe('AsideJefecarreraComponent', () => {
  let component: AsideJefecarreraComponent;
  let fixture: ComponentFixture<AsideJefecarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideJefecarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideJefecarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
