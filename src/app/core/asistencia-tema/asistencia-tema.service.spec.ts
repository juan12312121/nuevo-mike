import { TestBed } from '@angular/core/testing';

import { AsistenciaTemaService } from './asistencia-tema.service';

describe('AsistenciaTemaService', () => {
  let service: AsistenciaTemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciaTemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
