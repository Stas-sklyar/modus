import { TestBed } from '@angular/core/testing';

import { TrialNotebookService } from './trial-notebook.service';

describe('TrialNotebookService', () => {
  let service: TrialNotebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialNotebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
