import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideJefeGrupoComponent } from './aside-jefe-grupo.component';

describe('AsideJefeGrupoComponent', () => {
  let component: AsideJefeGrupoComponent;
  let fixture: ComponentFixture<AsideJefeGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideJefeGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideJefeGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
