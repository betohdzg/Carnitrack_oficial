import { TestBed } from '@angular/core/testing';

import { Nomina } from './nomina';

describe('Nomina', () => {
  let service: Nomina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nomina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
