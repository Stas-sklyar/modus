import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { TrialCaseNotebookSection } from '../../../models/interfaces/trial-case-notebook-section';
import { BackendApiService } from '../backend-api/backend-api.service';
import { TrialCasesService } from '../trial-cases/trial-cases.service';
import { guid } from 'odata-query';

@Injectable({
  providedIn: 'root',
})
export class TrialNotebookService {

  private _trialNotebookSections$ = new BehaviorSubject<TrialCaseNotebookSection[] | null>(null);
  get trialNotebookSections$(): Observable<TrialCaseNotebookSection[] | null> {
    return this._trialNotebookSections$.asObservable();
  }
  set trialNotebookSections(val: TrialCaseNotebookSection[] | null) {
    this._trialNotebookSections$.next(val);
  }

  private _expandedSectionId$ = new BehaviorSubject<string | null>(null);
  get expandedSectionId$(): Observable<string | null> {
    return this._expandedSectionId$.asObservable();
  }
  get expandedSectionId(): string | null {
    return this._expandedSectionId$.getValue();
  }
  set expandedSectionId(val: string | null) {
    this._expandedSectionId$.next(val);
  }


  constructor(
    private backendApiService: BackendApiService,
    private trialCasesService: TrialCasesService,
  ) { }

  fetchSections(): Observable<TrialCaseNotebookSection[]> {
    const selectedTrialCaseId = this.trialCasesService.selectedTrialCase?.id;

    return this.backendApiService.getEntitySet<TrialCaseNotebookSection>('notebookSections', {
      filter: {
        trialCaseId: guid(<string>selectedTrialCaseId),
      },
      expand: {
        cards: {
          expand: {
            personMentions: {},
          },
        },
      },
    })
      .pipe(
        tap(res => this.trialNotebookSections = res),
        take(1),
      );
  }

  // TODO remove createdByUserId parameter
  createSection(trialCaseId: string, title: string): Observable<TrialCaseNotebookSection> {
    const reqParams = {
      trialCaseId,
      title,
      createdByUserId: 'c618ee04-c665-4c17-8b69-39357eada3ba',
    };

    return this.backendApiService.postEntity<TrialCaseNotebookSection>('notebookSections', reqParams);
  }

  loadSectionContent(
    sectionId: string,
  ): Observable<TrialCaseNotebookSection> {
    return this.backendApiService.getEntity<TrialCaseNotebookSection>('notebookSections', sectionId);
  }

  updateSection(
    sectionId: string,
    title: string,
  ): Observable<TrialCaseNotebookSection> {
    return this.backendApiService.updateEntity<TrialCaseNotebookSection>('notebookSections', sectionId, { title });
  }
}
