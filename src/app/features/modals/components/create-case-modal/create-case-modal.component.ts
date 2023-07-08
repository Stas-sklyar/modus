import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { CaseCreateForm } from '../../../../models/interfaces';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-create-case-modal',
  templateUrl: './create-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCaseModalComponent implements OnDestroy {

  form = new FormGroup<CaseCreateForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initCaseCreation(): void {
    const { name, description } = this.form.value;

    this.form.disable();

    if (name) {
      this._subscription.add(
        this.trialCasesService.createTrialCase(name, description || '')
          .pipe(
            switchMap(() => this.trialCasesService.getTrialCases()),
            tap(() => this.notificationsService.notifySuccess(`Trial case '${name}' was created`)),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    } else {
      this.notificationsService.notifyError('Please enter the name of case');
    }
  }

}
