import { TestBed } from '@angular/core/testing';

import { CaseNarrativeEntitiesService } from './case-narrative-entities.service';

describe('CaseNarrativeEntitiesService', () => {
  let service: CaseNarrativeEntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseNarrativeEntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
