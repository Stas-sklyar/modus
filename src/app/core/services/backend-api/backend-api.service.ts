import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import buildQuery, { QueryOptions } from 'odata-query';
import { AuthTokenData } from '../../../models/interfaces';
import { SetOrderReqBody } from '../../../models/interfaces/set-order-request-body';

const endpoints = {
  login: `${environment.apiUrl}/api/auth/login`,
  refreshToken: `${environment.apiUrl}/api/auth/refreshtoken`,

  trialCase: `${environment.apiUrl}/v1/TrialCases`,
  favoriteTrialCases: `${environment.apiUrl}/v1/UserTrialCaseFavorites`,

  trialCaseTask: `${environment.apiUrl}/v1/TrialCaseTasks`,
  sortTasks: `${environment.apiUrl}/v1/TrialCaseTasks/SetOrder`,

  workbookFolder: `${environment.apiUrl}/v1/TrialCaseFolders`,
  sortFolders: `${environment.apiUrl}/v1/TrialCaseFolders/SetOrder`,
  workbookSection: `${environment.apiUrl}/v1/TrialCaseSections`,
  sortSections: `${environment.apiUrl}/v1/TrialCaseSections/SetOrder`,
  workbookSubsection: `${environment.apiUrl}/v1/TrialCaseSubSections`,
  sortSubsections: `${environment.apiUrl}/v1/TrialCaseSubSections/SetOrder`,
  card: `${environment.apiUrl}/v1/TrialCaseCards`,
  sortCards: `${environment.apiUrl}/v1/TrialCaseCards/SetOrder`,
  cardNote: `${environment.apiUrl}/v1/TrialCaseCardNotes`,
  cardComment: `${environment.apiUrl}/v1/TrialCaseCardUserComments`,
  cardDocument: `${environment.apiUrl}/v1/FileDocumentTrialCaseCard`,

  trialCaseTag: `${environment.apiUrl}/v1/TrialCaseTags`,
  trialCasePeople: `${environment.apiUrl}/v1/TrialCasePeople`,

  userComments: `${environment.apiUrl}/v1/UserComments`,
  sortCardNotes: `${environment.apiUrl}/v1/TrialCaseCardNotes/SetOrder`,

  users: `${environment.apiUrl}/v1/Users`,
  account: `${environment.apiUrl}/v1/Users/Profile()`,

  timelineEvent: `${environment.apiUrl}/v1/TimelineEvents`,
  timelineEventTag: `${environment.apiUrl}/v1/TimelineEventTags`,
  timelineEventNote: `${environment.apiUrl}/v1/TimelineEventNotes`,
  sortTimelineEventNotes: `${environment.apiUrl}/v1/TimelineEventNotes/SetOrder`,
  timelineEventComment: `${environment.apiUrl}/v1/TimelineEventUserComments`,

  people: `${environment.apiUrl}/v1/TrialCasePeople`,
  notebookSections: `${environment.apiUrl}/v1/TrialCaseNotebookSections`,
  sortNotebookSections: `${environment.apiUrl}/v1/TrialCaseNotebookSections/SetOrder`,
  sortNotebookCards: `${environment.apiUrl}/v1/TrialCaseCards/SetOrder`,
  documentFolders: `${environment.apiUrl}/v1/DocumentFolders`,
  documents: `${environment.apiUrl}/v1/Documents`,

  narrativeStory: `${environment.apiUrl}/v1/TrialCaseNarrativeStories`,
  narrativeStoryItems: `${environment.apiUrl}/v1/TrialCaseNarrativeStoryItems`,
  sortNarrativeStoryItems: `${environment.apiUrl}/v1/TrialCaseNarrativeStoryItems/SetOrder`,
  narrativeStoryComment: `${environment.apiUrl}/v1/TrialCaseNarrativeStoryUserComments`,
  sortNarrativeStories: `${environment.apiUrl}/v1/TrialCaseNarrativeStories/SetOrder`,
  sortStoryItems: `${environment.apiUrl}/api/v1/TrialCaseNarrativeStoryItems/RangePatch`,
};

export type OdataEntity = keyof typeof endpoints;

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {

  constructor(
    private http: HttpClient,
  ) {}

  login(
    body: any,
  ): Observable<AuthTokenData> {
    return this.http.post<AuthTokenData>(`${environment.apiUrl}/api/auth/login`, body);
  }

  getApplicationUser<T>(
    entity: OdataEntity,
    queryOptions?: Partial<QueryOptions<unknown>>,
  ): Observable<T> {
    const query = buildQuery(queryOptions);
    return this.http.get<T>(`${endpoints[entity]}${query}`);
  }

  refreshToken(
    body: any,
  ): Observable<AuthTokenData> {
    return this.http.post<AuthTokenData>(`${environment.apiUrl}/api/auth/refreshToken`, body);
  }

  invite(
    body: any,
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/companies/invite`, body);
  }

  register(
    body: any,
  ): Observable<AuthTokenData> {
    return this.http.post<AuthTokenData>(`${environment.apiUrl}/api/account/register`, body);
  }

  registerAdmin(
    body: any,
  ): Observable<AuthTokenData> {
    return this.http.post<AuthTokenData>(`${environment.apiUrl}/api/auth/register-admin`, body);
  }

  getResetPasswordLink(
    body: any,
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/account/reset-password-reset-link`, body);
  }

  updatePassword(
    body: any,
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/account/reset-password`, body);
  }

  uploadFile(
    body: FormData,
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/v1/Documents/UploadFile`, body);
  }

  editDocument<T>(
    entity: OdataEntity,
    id: string,
    body: FormData,
  ): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}/v1/Documents(${id})/EditDocument`, body);
  }

  loadFile(
    id: string,
  ): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/octet-stream; charset=utf-8');
    return this.http.post(
      `${environment.apiUrl}/v1/Files/LoadFile(${id})`,
      {},
      {
        headers,
        responseType: 'blob' as const,
      });
  }

  getEntity<T>(
    entity: OdataEntity,
    id: number | string,
    queryOptions?: Partial<QueryOptions<unknown>>,
  ): Observable<T> {
    const query = buildQuery(queryOptions);
    return this.http.get<T>(`${endpoints[entity]}(${id})${query}`);
  }

  getEntitySet<T>(
    entity: OdataEntity,
    queryOptions?: Partial<QueryOptions<any>>,
  ): Observable<T[]> {
    const query = buildQuery(queryOptions);
    return this.http.get<T[]>(`${endpoints[entity]}${query}`).pipe(
      map((res: any) => res?.value),
    );
  }

  postEntity<T>(entity: OdataEntity, body: Partial<T>): Observable<T> {
    return this.http.post<T>(`${endpoints[entity]}`, body);
  }

  sortEntities<T>(entity: OdataEntity, body: SetOrderReqBody): Observable<T> {
    return this.http.post<T>(`${endpoints[entity]}`, body);
  }

  sortStoryItems<T>(entity: OdataEntity, body: { id: string; trialCaseNarrativeStoryItemId: string | null; order: number; }[]): Observable<T> {
    return this.http.patch<T>(`${endpoints[entity]}`, body);
  }

  updateEntity<T>(
    entity: OdataEntity,
    id: string,
    body: Partial<T>,
  ): Observable<T> {
    return this.http.patch<T>(`${endpoints[entity]}/${id}`, body);
  }

  deleteEntity<T>(
    entity: OdataEntity,
    id: string,
  ): Observable<T> {
    return this.http.delete<T>(`${endpoints[entity]}/${id}`);
  }

  recentActivities(): Observable<any> {
    return this.http.get<any>('api/recentActivities');
  }

  updateCard<T>(
    entity: OdataEntity,
    id: string,
    body: Partial<T>,
  ): Observable<T> {
    return this.http.patch<T>(`${endpoints[entity]}/${id}`, body);
  }

}
