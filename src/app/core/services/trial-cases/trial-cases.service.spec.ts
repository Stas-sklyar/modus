import { TestBed } from '@angular/core/testing';

import { TrialCasesService } from './trial-cases.service';

describe('TrialCasesService', () => {
  let service: TrialCasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialCasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
