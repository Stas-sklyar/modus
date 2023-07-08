import { TestBed } from '@angular/core/testing';

import { TimelineEventsService } from './timeline-events.service';

describe('TimelineEventsService', () => {
  let service: TimelineEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
