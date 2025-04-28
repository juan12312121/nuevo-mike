import { TestBed } from '@angular/core/testing';

import { AsignacionMateriasService } from './asignacion-materias.service';

describe('AsignacionMateriasService', () => {
  let service: AsignacionMateriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionMateriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
