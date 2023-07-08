import { TestBed } from '@angular/core/testing';

import { TimelineEventEntitiesService } from './timeline-event-entities.service';

describe('TimelineEventEntitiesService', () => {
  let service: TimelineEventEntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineEventEntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
