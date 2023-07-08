import { TestBed } from '@angular/core/testing';

import { NarrativeStoriesService } from './narrative-stories.service';

describe('NarrativeStoriesService', () => {
  let service: NarrativeStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NarrativeStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
