import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePersonForm } from '../../../../models/interfaces/create-person-form';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, Subscription, switchMap, take } from 'rxjs';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';

@Component({
  selector: 'lr-create-person-modal',
  templateUrl: './create-person-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePersonModalComponent implements OnDestroy {
  form = new FormGroup<CreatePersonForm>({
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
    private trialCasePeopleService: TrialCasePeopleService,
    private bsModalRef: BsModalRef,
    private trialCasesService: TrialCasesService,
  ) {}

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createPerson(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const {
      name,
      userType,
      email,
      phoneNumber,
      address,
      description,
    } = this.form.value;

    this.form.disable();

    if (name && userType) {
      this._subscription.add(
        this.trialCasePeopleService.createPerson(
          name,
          userType,
          trialCaseId || '',
          email,
          phoneNumber,
          address,
          description,
        )
          .pipe(
            switchMap(() => this.trialCasePeopleService.getTrialCasePeople(trialCaseId || '')),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe({
            next: () => {
              this.notificationsService.notifySuccess('Person was created');
              this.closeModal();
            },
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
