import { TestBed } from '@angular/core/testing';

import { IdPassService } from './id-pass.service';

describe('IdPassService', () => {
  let service: IdPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
