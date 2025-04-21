import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideAdministradorComponent } from './aside-administrador.component';

describe('AsideAdministradorComponent', () => {
  let component: AsideAdministradorComponent;
  let fixture: ComponentFixture<AsideAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
