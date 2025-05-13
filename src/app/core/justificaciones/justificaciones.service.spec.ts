import { TestBed } from '@angular/core/testing';

import { JustificacionesService } from './justificaciones.service';

describe('JustificacionesService', () => {
  let service: JustificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
