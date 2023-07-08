import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { EditCaseForm } from '../../../../models/interfaces/edit-case-form';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCase } from '../../../../models/interfaces';

@Component({
  selector: 'lr-edit-case-modal',
  templateUrl: './edit-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCaseModalComponent implements OnInit, OnDestroy {
  @Input() caseId!: string;
  form = new FormGroup<EditCaseForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  case$: Observable<TrialCase | null> | null = null;
  private _subscription = new Subscription();

  constructor(
    private trialCasesService: TrialCasesService,
    private notificationsSrv: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    this.case$ = this.trialCasesService.loadMainDataByTrialCase(this.caseId)
      .pipe(
        tap((trialCase) => {
          if (trialCase) {
            this.form.get('name')?.setValue(trialCase.name);
            this.form.get('description')?.setValue(trialCase.description);
          }
        }),
      );
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  editCase(): void {
    const { name, description } = this.form.value;

    if (name) {
      this.form.disable();

      this._subscription.add(
        this.trialCasesService.updateTrialCase(this.caseId, name, description || '')
          .pipe(
            switchMap(() => this.trialCasesService.loadFullDataByTrialCase(this.caseId || '')),
            tap(() => this.notificationsSrv.notifySuccess('Trial case was edited')),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    } else {
      this.notificationsSrv.notifyError('Please fill in all required fields');
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
