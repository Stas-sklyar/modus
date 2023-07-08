import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditPersonForm } from '../../../../models/interfaces/edit-person-form';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, forkJoin, Subscription, switchMap, take } from 'rxjs';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { TrialCasePerson } from '../../../../models/interfaces/trial-case-person';

@Component({
  selector: 'lr-edit-person-modal',
  templateUrl: './edit-person-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPersonModalComponent implements OnInit, OnDestroy {
  @Input() person!: TrialCasePerson;

  form = new FormGroup<EditPersonForm>({
    name: new FormControl('', Validators.required),
    userType: new FormControl(null, Validators.required),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    description: new FormControl(''),
  });

  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private trialCasePeopleService: TrialCasePeopleService,
    private trialCasesService: TrialCasesService,
  ) {}

  ngOnInit(): void {
    this.fillFormData(this.person);
  }

  fillFormData(person: TrialCasePerson): void {
    this.form.get('name')?.setValue(person.name);
    this.form.get('userType')?.setValue(person.userType);
    this.form.get('email')?.setValue(person.email);
    this.form.get('phoneNumber')?.setValue(person.phoneNumber);
    this.form.get('address')?.setValue(person.address);
    this.form.get('description')?.setValue(person.description);
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  editPerson(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    const {
      name,
      userType,
      email,
      phoneNumber,
      address,
      description,
    } = this.form.value;

    if (name && userType && trialCaseId) {
      this.form.disable();

      this._subscription.add(
        this.trialCasePeopleService.updatePerson(
          this.person.id,
          name,
          userType,
          email,
          phoneNumber,
          address,
          description,
        )
          .pipe(
            switchMap(() => forkJoin([
              this.trialCasePeopleService.getTrialCasePerson(this.person.id),
              this.trialCasePeopleService.getTrialCasePeople(trialCaseId || ''),
            ])),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe(() => {
            this.notificationsService.notifySuccess('Person was edited');
            this.closeModal();
          }),
      );
    } else {
      this.notificationsService.notifyError('Enter required field');
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
