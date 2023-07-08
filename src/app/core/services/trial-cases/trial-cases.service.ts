import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TrialCase } from '../../../models/interfaces';
import { BackendApiService } from '../backend-api/backend-api.service';
import { UserTrialCaseFavorite } from '../../../models/interfaces/user-trial-case-favorite';
import { guid } from 'odata-query';

@Injectable({
  providedIn: 'root',
})
export class TrialCasesService {

  private _trialCases$ = new BehaviorSubject<TrialCase[] | null>(null);
  get trialCases(): TrialCase[] | null {
    return this._trialCases$.getValue();
  }
  get trialCases$(): Observable<TrialCase[] | null> {
    return this._trialCases$
      .asObservable();
  }
  set trialCases(
    cases: TrialCase[] | null,
  ) {
    this._trialCases$.next(cases);
  }

  private _selectedTrialCase$ = new BehaviorSubject<TrialCase | null>(null);
  get selectedTrialCase(): TrialCase | null {
    return this._selectedTrialCase$.getValue();
  }
  get selectedTrialCase$(): Observable<TrialCase | null> {
    return this._selectedTrialCase$
      .asObservable();
  }
  set selectedTrialCase(
    newCase: TrialCase | null,
  ) {
    this._selectedTrialCase$.next(newCase);
  }

  constructor(
    private backendApiService: BackendApiService,
  ) { }

  getTrialCases(userId?: string): Observable<TrialCase[] | null> {
    return this.backendApiService.getEntitySet<TrialCase>('trialCase', {
      expand: {
        userTrialCaseFavorites: {
          ...(userId && {
            filter: {
              userId: guid(userId),
            },
          }),
          expand: {
            trialCase: {},
          },
        },
      },
    })
      .pipe(
        tap(res => this.trialCases = res),
      );
  }

  loadFullDataByTrialCase(
    trialCaseId: string,
  ): Observable<TrialCase | null> {
    return this.backendApiService.getEntity<TrialCase>('trialCase', trialCaseId, {
      expand: {
        trialCasePersons: {
          filter: {
            isDeleted: false,
          },
        },
        notebookSections: {
          expand: {
            cards: {
              expand: {
                personMentions: {},
              },
            },
          },
        },
      },
    })
      .pipe(
        tap(trialCase => {
          this.selectedTrialCase = trialCase;
        }),
      );
  }

  loadMainDataByTrialCase(
    trialCaseId: string,
  ): Observable<TrialCase | null> {
    return this.backendApiService.getEntity<TrialCase>('trialCase', trialCaseId, {});
  }

  createTrialCase(
    name: string,
    description: string,
  ): Observable<TrialCase> {
    const reqParams = {
      name,
      description,
    };

    return this.backendApiService.postEntity<TrialCase>('trialCase', reqParams);
  }

  createFavoriteTrialCase(
    trialCaseId: string,
  ): Observable<UserTrialCaseFavorite> {
    const reqParams = {
      trialCaseId,
    };

    return this.backendApiService.postEntity<UserTrialCaseFavorite>('favoriteTrialCases', reqParams);
  }

  getFavoriteTrialCaseByUserId(
    userId: string,
  ): Observable<UserTrialCaseFavorite[]> {

    return this.backendApiService.getEntitySet<UserTrialCaseFavorite>('favoriteTrialCases', {
      filter: {
        userId: guid(userId),
      },
      expand: {
        trialCase: {},
      },
    });
  }

  deleteFavoriteTrialCase(
    caseId: string,
  ): Observable<UserTrialCaseFavorite> {
    return this.backendApiService.deleteEntity<UserTrialCaseFavorite>('favoriteTrialCases', caseId);
  }

  updateTrialCase(
    caseId: string,
    name: string,
    description: string,
  ): Observable<TrialCase> {
    const reqParams = {
      name,
      description,
    };

    return this.backendApiService.updateEntity<TrialCase>('trialCase', caseId, reqParams);
  }

  eraseServiceStorage(): void {
    this.trialCases = null;
    this.selectedTrialCase = null;
  }

  eraseCurrentCase(): void {
    this.selectedTrialCase = null;
  }
}
