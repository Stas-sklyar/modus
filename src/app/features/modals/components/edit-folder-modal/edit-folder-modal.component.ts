import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { FolderEditForm } from '../../../../models/interfaces/folder-edit-form';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCaseFolder } from '../../../../models/interfaces/trial-case-folder';

@Component({
  selector: 'lr-create-folder-form',
  templateUrl: './edit-folder-modal.component.html',
  styleUrls: ['./edit-folder-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFolderModalComponent implements OnInit, OnDestroy {
  @Input() folderId!: string;

  form = new FormGroup<FolderEditForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    accessLevel: new FormControl('free'),
  });
  folder$: Observable<TrialCaseFolder> | null = null;
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }



  ngOnInit(): void {
    this.folder$ = this.caseEntitiesService.loadFolderContent(this.folderId)
      .pipe(
        tap(folder => {
          this.form.get('name')?.setValue(folder.name);
          this.form.get('description')?.setValue(folder.description);
        }),
      );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initFolderEditing(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const { name, description, accessLevel } = this.form.value;

    if (this.folderId && name &&  accessLevel) {
      this.form.disable();

      this._subscription.add(
        this.caseEntitiesService.updateWorkbookFolder(this.folderId, name, description || '', accessLevel)
          .pipe(
            switchMap(() => this.caseEntitiesService.loadFoldersByTrialCaseId(trialCaseId || '')),
            tap(() => this.notificationsService.notifySuccess(`Workbook folder '${name}' was edited`)),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    }
  }
}
