import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCaseNotebookCreateSectionTs } from '../../../../models/interfaces/trial-case-notebook-create-section.ts';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';

@Component({
  selector: 'lr-create-notebook-section-modal',
  templateUrl: './create-notebook-section-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotebookSectionModalComponent implements OnDestroy {
  @Input() trialCaseId!: string;

  sectionForm = new FormGroup<TrialCaseNotebookCreateSectionTs>({
    title: new FormControl('', Validators.required),
  });
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private trialNotebookService: TrialNotebookService,
  ) { }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initSectionCreation(): void {
    const { title } = this.sectionForm.value;

    this.sectionForm.disable();

    if (this.trialCaseId && title) {
      this._subscription.add(
        this.trialNotebookService.createSection(this.trialCaseId, title)
          .pipe(
            switchMap(() => this.trialNotebookService.fetchSections()),
            tap(() => this.notificationsService.notifySuccess(`Trial Notebook section '${title}' was created`)),
            take(1),
            finalize(() => this.sectionForm.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    } else {
      this.notificationsService.notifyWarning('Section title required');
    }
  }

}
