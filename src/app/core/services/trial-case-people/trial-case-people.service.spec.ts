import { TestBed } from '@angular/core/testing';

import { TrialCasePeopleService } from './trial-case-people.service';

describe('TrialCasePeopleService', () => {
  let service: TrialCasePeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialCasePeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
