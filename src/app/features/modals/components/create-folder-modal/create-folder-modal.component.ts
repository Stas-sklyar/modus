import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FolderCreateForm } from '../../../../models/interfaces';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-create-folder-modal',
  templateUrl: './create-folder-modal.component.html',
  styleUrls: ['./create-folder-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFolderModalComponent implements OnDestroy {
  @Input() caseId!: string;

  folderForm = new FormGroup<FolderCreateForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    accessLevel: new FormControl('free', Validators.required),
  });
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsSrv: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initFolderCreation(): void {
    const { name, description, accessLevel } = this.folderForm.value;
    this.folderForm.disable();

    if (this.caseId && name && accessLevel) {
      this._subscription.add(
        this.caseEntitiesService.createWorkbookFolder(this.caseId, name, description || '', accessLevel)
          .pipe(
            switchMap(() => this.caseEntitiesService.loadFoldersByTrialCaseId(this.caseId)),
            tap(() => this.notificationsSrv.notifySuccess(`Workbook folder '${name}' was created`)),
            take(1),
            finalize(() => this.folderForm.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    }
  }
}
