import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { TrialCaseTag } from '../../../models/interfaces/trial-case-tag';
import { guid } from 'odata-query';
import { TrialCasesService } from '../trial-cases/trial-cases.service';
import { TimelineEventTag } from '../../../models/interfaces/timeline-event-tag';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private _trialCaseTags$ = new BehaviorSubject<TrialCaseTag[] | null>(null);
  private _tagsByTrialCaseId$ = new BehaviorSubject<TrialCaseTag[] | null>(null);

  get trialCaseTags$(): Observable<TrialCaseTag[] | null> {
    return this._trialCaseTags$
      .asObservable();
  }
  set trialCaseTags(
    timelineEventTags: TrialCaseTag[] | null,
  ) {
    this._trialCaseTags$.next(timelineEventTags);
  }

  get tagsByTrialCaseId$(): Observable<TrialCaseTag[] | null> {
    return this._tagsByTrialCaseId$
      .asObservable();
  }
  set tagsByTrialCaseId(
    timelineEventTags: TrialCaseTag[] | null,
  ) {
    this._tagsByTrialCaseId$.next(timelineEventTags);
  }
  constructor(
    private backendApiService: BackendApiService,
    private trialCasesService: TrialCasesService,
  ) { }

  getTagsByTrialCaseId(
    trialCaseId?: string,
  ): Observable<TrialCaseTag[] | null> {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id || '';

    return this.backendApiService.getEntitySet<TrialCaseTag>('trialCaseTag', {
      filter: {
        trialCaseId: guid(trialCaseId || selectedCaseId),
      },
    })
      .pipe(
        tap(res => this.tagsByTrialCaseId = res),
      );
  }

  getTagsById(
    id: string,
  ): Observable<TrialCaseTag | null> {
    return this.backendApiService.getEntity<TrialCaseTag>('trialCaseTag', id);
  }

  createTag(
    name: string,
    trialCaseId?: string,
  ): Observable<TrialCaseTag> {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id || '';

    const reqParams = {
      name,
      trialCaseId: trialCaseId || selectedCaseId,
    };

    return this.backendApiService.postEntity<TrialCaseTag>('trialCaseTag', reqParams);
  }

  createTimelineEventTag(
    timelineEventId: string,
    trialCaseTagId: string,
  ): Observable<TimelineEventTag> {
    const reqParams = {
      timelineEventId,
      trialCaseTagId,
    };

    return this.backendApiService.postEntity<TimelineEventTag>('timelineEventTag', reqParams);
  }

  deleteTimelineEventTag(
    id: string,
  ): Observable<TimelineEventTag> {
    return this.backendApiService.deleteEntity<TimelineEventTag>('timelineEventTag', id);
  }
}
