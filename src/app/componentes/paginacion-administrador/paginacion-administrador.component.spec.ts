import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginacionAdministradorComponent } from './paginacion-administrador.component';

describe('PaginacionAdministradorComponent', () => {
  let component: PaginacionAdministradorComponent;
  let fixture: ComponentFixture<PaginacionAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginacionAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginacionAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
