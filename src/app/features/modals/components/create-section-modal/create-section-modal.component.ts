import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SectionCreateForm } from '../../../../models/interfaces';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-create-section-modal',
  templateUrl: './create-section-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSectionModalComponent implements OnDestroy {
  @Input() folderId!: string;

  sectionForm = new FormGroup<SectionCreateForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initSectionCreation(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const { name, description } = this.sectionForm.value;

    this.sectionForm.disable();

    if (this.folderId && name) {
      this._subscription.add(
        this.caseEntitiesService.createWorkbookSection(this.folderId, name, description || '')
          .pipe(
            tap(() => {
              this.caseEntitiesService.expandedWorkbookFolderId = this.folderId;
            }),
            switchMap(() => this.trialCasesService.loadFullDataByTrialCase(trialCaseId || '')),
            tap(() => this.notificationsService.notifySuccess(`Workbook section '${name}' was created`)),
            take(1),
            finalize(() => this.sectionForm.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    } else {
      this.notificationsService.notifySuccess('Enter folder name');
    }
  }

}
