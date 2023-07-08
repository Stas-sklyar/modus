import { TestBed } from '@angular/core/testing';

import { CaseEntitiesService } from './case-entities.service';

describe('CaseEntitiesService', () => {
  let service: CaseEntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseEntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
