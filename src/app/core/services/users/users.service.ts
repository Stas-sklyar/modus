import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../../models/interfaces/user';
import { TrialCase } from '../../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users$ = new BehaviorSubject<User[] | null>(null);
  get users(): User[] | null {
    return this._users$.getValue();
  }
  get users$(): Observable<User[] | null> {
    return this._users$
      .asObservable();
  }
  set users(
    users: User[] | null,
  ) {
    this._users$.next(users);
  }
  private _selectedUser$ = new BehaviorSubject<User | null>(null);
  get selectedUser$(): Observable<User | null> {
    return this._selectedUser$.asObservable();
  }
  set selectedUser(val: User | null) {
    this._selectedUser$.next(val);
  }

  private _currentUser$ = new BehaviorSubject<User | null>(null);
  get currentUser(): User | null {
    return this._currentUser$.getValue();
  }
  get currentUser$(): Observable<User | null> {
    return this._currentUser$
      .asObservable();
  }
  set currentUser(
    user: User | null,
  ) {
    this._currentUser$.next(user);
  }
  constructor(
    private backendApiService: BackendApiService,
  ) { }

  getUsers(): Observable<User[] | null> {
    return this.backendApiService.getEntitySet<User>('users', {
      expand: {
        trialCaseUserRoles: {
          expand: {
            trialCase: {},
          },
        },
        createdCases: {},
        userTrialCaseFavorites: {
          expand: {
            trialCase: {},
          },
        },
        company: {},
      },
    })
      .pipe(
        tap(users => this.users = users),
      );
  }

  getParticipant(id: string): Observable<User | null> {
    return this.backendApiService.getEntity<User>('users', id, {
      expand: {
        company: {},
        trialCaseUserRoles: {
          expand: {
            trialCase: {},
          },
        },
        createdCases: {},
        userTrialCaseFavorites: {
          expand: {
            trialCase: {},
          },
        },
      },
    })
      .pipe(
        tap(participant => this.selectedUser = participant),
      );
  }

  getCurrentAppUser(): Observable<User> {
    return this.backendApiService.getApplicationUser<User>('account', {
      expand: {
        userTrialCaseFavorites: {},
      },
    })
      .pipe(
        tap(response => {
          // TODO: REMOVE TS IGNORE AFTER API FIX
          // @ts-ignore
          this.currentUser = response.value[0];
        }),
      );
  }

  getBelongsToUserCases(user: User): TrialCase[] {
    const createdCases = user.createdCases || [];
    const favoriteCases = user.userTrialCaseFavorites.map(i => (i.trialCase as TrialCase));
    return  favoriteCases.reduce((acc, item) => {
      return acc.find(i => i.id === item.id) ? acc : [...acc, item];
    }, [...createdCases]);
  }

  hasRelationToCases(user: User): boolean {
    const createdCases = user.createdCases || [];
    const favoriteCases = user.userTrialCaseFavorites || [];
    return !!(createdCases.length && favoriteCases.length);
  }

  changeParticipantData(
    id: string,
    user: Partial<User>,
  ): Observable<User> {
    return this.backendApiService.updateEntity<User>('users', id, user);
  }

  removeParticipant(id: string): Observable<void> {
    return this.backendApiService.deleteEntity('users', id);
  }
}
