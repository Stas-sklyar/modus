import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { Modal } from '../../../../models/enums/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  CreatePersonModalComponent,
} from '../../../modals/components/create-person-modal/create-person-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { Subscription } from 'rxjs';
import { TrialCasePerson } from '../../../../models/interfaces/trial-case-person';

@Component({
  selector: 'lr-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleComponent implements OnInit, OnDestroy {
  caseId = this.route.parent?.snapshot.paramMap.get('caseId');
  selectedCase$ = this.trialCasesService.selectedTrialCase$;
  casePeople$ = this.trialCasePeopleService.people$;
  filteredPeople: TrialCasePerson[] = [];
  filterIsActive = false;
  searchQuery = '';
  categories: string[] = [];
  private _subscription = new Subscription();

  constructor(
    private trialCasesService: TrialCasesService,
    private router: Router,
    private route: ActivatedRoute,
    private bsModalService: BsModalService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) { }

  ngOnInit(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople(this.caseId || '').subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  openPersonPreviewPanel(personId: string): void {
    this.router.navigate([], { queryParams: {
      personId: personId,
    } });
  }

  openCreatePersonModal(): void {
    this.bsModalService.show(CreatePersonModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreatePerson,
      keyboard: true,
    });
  }

  filterPeople(searchQuery: string, userTypes: string[], people: TrialCasePerson[]): void {
    this.filteredPeople = [];
    this.filterIsActive = true;
    this.searchQuery = searchQuery;
    this.categories = userTypes;

    for (let i = 0; i < people.length; i++) {
      let personIsPassedFilterBySearchQueryCheck = true;
      if (searchQuery.length) {
        personIsPassedFilterBySearchQueryCheck = people[i].name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      let personIsPassedFilterByUserTypeCheck = true;
      if (userTypes.length) {
        for (let j = 0; j < userTypes.length; j++) {
          personIsPassedFilterByUserTypeCheck = people[i].userType.toLowerCase() === userTypes[j].toLowerCase();
          if (personIsPassedFilterByUserTypeCheck) {
            break;
          }
        }
      }

      if (personIsPassedFilterBySearchQueryCheck && personIsPassedFilterByUserTypeCheck) {
        this.filteredPeople.push(people[i]);
      }
    }
  }

  calcUserTypesList(people: TrialCasePerson[]): string[] {
    return people.map(person => person.userType);
  }
}
