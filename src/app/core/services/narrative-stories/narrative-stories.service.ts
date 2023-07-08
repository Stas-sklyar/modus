import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TrialCaseNarrativeStory } from '../../../models/interfaces/trial-case-narrative-story';
import { BackendApiService } from '../backend-api/backend-api.service';
import { guid } from 'odata-query';

@Injectable({
  providedIn: 'root',
})
export class NarrativeStoriesService {
  private _narrativeStories$ = new BehaviorSubject<TrialCaseNarrativeStory[] | null>(null);

  get narrativeStories$(): Observable<TrialCaseNarrativeStory[] | null> {
    return this._narrativeStories$
      .asObservable();
  }
  set narrativeStories(narrativeStories: TrialCaseNarrativeStory[] | null) {
    this._narrativeStories$.next(narrativeStories);
  }
  constructor(
    private backendApiService: BackendApiService,
  ) { }

  loadNarrativeStoriesByTrialCaseId(
    trialCaseId: string,
  ): Observable<TrialCaseNarrativeStory[]> {
    this.narrativeStories = null;

    return this.backendApiService.getEntitySet<TrialCaseNarrativeStory>('narrativeStory', {
      filter: {
        trialCaseId: guid(trialCaseId),
        isDeleted: false,
      },
      expand: {
        trialCaseNarrativeStoryItems: {
          expand: {
            items: {},
          },
          filter: {
            trialCaseNarrativeStoryItemId: null,
            isDeleted: false,
          },
        },
      },
    })
      .pipe(
        tap(narrativeStories => this.narrativeStories = narrativeStories),
      );
  }
}
