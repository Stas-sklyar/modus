import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { TrialCasePerson } from '../../../models/interfaces/trial-case-person';
import { guid } from 'odata-query';
import { TrialCasesService } from '../trial-cases/trial-cases.service';

@Injectable({
  providedIn: 'root',
})
export class TrialCasePeopleService {

  private _people$ = new BehaviorSubject<TrialCasePerson[] | null>(null);
  get people$(): Observable<TrialCasePerson[] | null> {
    return this._people$.asObservable();
  }
  set people(people: TrialCasePerson[] | null) {
    this._people$.next(people);
  }

  private _selectedPerson$ = new BehaviorSubject<TrialCasePerson | null>(null);
  get selectedPerson$(): Observable<TrialCasePerson | null> {
    return this._selectedPerson$.asObservable();
  }
  set selectedPerson(person: TrialCasePerson | null) {
    this._selectedPerson$.next(person);
  }

  constructor(
    private backendApiService: BackendApiService,
    private trialCasesService: TrialCasesService,
  ) { }

  getTrialCasePeople(caseId?: string): Observable<TrialCasePerson[] | null> {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id || '';

    return this.backendApiService.getEntitySet<TrialCasePerson>('people', {
      filter: {
        trialCaseId: guid(caseId || selectedCaseId),
      },
    })
      .pipe(
        tap(res => this.people = res),
      );
  }

  getTrialCasePerson(personId: string): Observable<TrialCasePerson | null> {
    return this.backendApiService.getEntity<TrialCasePerson>('people', personId)
      .pipe(
        tap(res => this.selectedPerson = res),
      );
  }

  createPerson(
    name: string,
    userType: string,
    trialCaseId: string,
    email: string | null | undefined,
    phoneNumber: string | null | undefined,
    address: string | null | undefined,
    description: string | null | undefined,
  ): Observable<TrialCasePerson> {
    const reqParams = {
      name,
      userType,
      trialCaseId,
      email: email ? email : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
      address: address ? address : null,
      description: description ? description : null,
    };

    return this.backendApiService.postEntity<TrialCasePerson>('trialCasePeople', reqParams);
  }

  updatePerson(
    id: string,
    name: string,
    userType: string,
    email: string | null | undefined,
    phoneNumber: string | null | undefined,
    address: string | null | undefined,
    description: string | null | undefined,
  ): Observable<TrialCasePerson> {
    const reqParams = {
      name,
      userType,
      email: email ? email : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
      address: address ? address : null,
      description: description ? description : null,
    };

    return this.backendApiService.updateEntity<TrialCasePerson>('trialCasePeople', id, reqParams);
  }

  getMentionedPeopleList(value: string): { trialCasePersonId: string }[] {
    const re = /data-id=\"((?:\\.|[^"\\])*)/gm;
    return value.match(re)?.map(dataAttr => ({
      trialCasePersonId: dataAttr.slice(9),
    })) || [];
  }
}
