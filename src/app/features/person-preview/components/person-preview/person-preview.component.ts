import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Modal } from '../../../../models/enums/modal';
import { EditPersonModalComponent } from '../../../modals/components/edit-person-modal/edit-person-modal.component';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { TrialCasePerson } from '../../../../models/interfaces/trial-case-person';

// TODO: ADD DOCUMENT TAB
// type Category = 'profile' | 'documents';
type Category = 'profile';

@Component({
  selector: 'lr-person-preview',
  templateUrl: './person-preview.component.html',
  styleUrls: ['./person-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonPreviewComponent implements OnInit, OnDestroy {
  personId = this.route.snapshot.queryParamMap.get('personId');
  selectedPerson$ = this.trialCasePeopleService.selectedPerson$;
  selectedCategory$ = new BehaviorSubject<Category>('profile');
  private _subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) { }

  ngOnInit(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePerson(this.personId || '').subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.trialCasePeopleService.selectedPerson = null;
  }

  closePanel(): void {
    this.router.navigate([], { queryParams: {
      personId: null, backTo: null,
    } });
  }

  openEditPersonModal(person: TrialCasePerson): void {
    this.bsModalService.show(EditPersonModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditPerson,
      initialState: {
        person,
      },
      keyboard: true,
    });
  }
}
