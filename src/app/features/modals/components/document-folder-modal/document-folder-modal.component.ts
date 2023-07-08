import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentFolderForm } from '../../../../models/interfaces/document-folder-form';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { finalize, Subscription, switchMap, tap } from 'rxjs';
import { DocumentFolder } from '../../../../models/interfaces/document-folder';
import { WithCounters } from '../../../../models/interfaces/withCounters';

@Component({
  selector: 'lr-document-folder-modal',
  templateUrl: './document-folder-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFolderModalComponent implements OnInit, OnDestroy {
  @Input() folder: (DocumentFolder & WithCounters) | null = null;
  @Input() action: 'create' | 'edit' = 'create';
  form = new FormGroup<DocumentFolderForm>({
    name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
  });
  submitting = false;
  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private documentsService: DocumentsService,
    private trialCaseService: TrialCasesService,
  ) {}

  ngOnInit(): void {
    if (this.action === 'edit') {
      this.setInitialFolderName();
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get allowAction(): boolean {
    return this.isCreation || (!this.isCreation && this.selectedFolder);
  }

  get isCreation(): boolean {
    return this.action === 'create';
  }

  get selectedFolder(): boolean {
    return !!this.folder;
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createFolder(): void {
    const { name } = this.form.value;
    const trialCaseId = this.trialCaseService.selectedTrialCase?.id;

    if (name && trialCaseId) {
      this.submitting = true;
      this._subscription.add(
        this.documentsService.createFolder(trialCaseId, name)
          .pipe(
            switchMap(() => this.documentsService.fetchDocumentFolders()),
            finalize(() => this.submitting = false),
          )
          .subscribe(() => {
            this.notificationsService.notifySuccess(`Folder '${ name }' created`);
            this.closeModal();
          }),
      );
    }
  }

  editFolder(): void {
    const { name } = this.form.value;
    const folderId = this.folder?.id;

    if (name && folderId) {
      this.submitting = true;
      this._subscription.add(
        this.documentsService.editFolder(folderId, name)
          .pipe(
            switchMap(() => this.documentsService.fetchDocumentFolders()),
            tap((documentFolders) => {
              const updatedFolder = documentFolders?.find(i => i.id === folderId);
              if (updatedFolder) {
                this.documentsService.selectedFolder = updatedFolder;
              }
            }),
            finalize(() => this.submitting = false),
          )
          .subscribe(() => {
            this.notificationsService.notifySuccess(`Folder '${ name }' changed`);
            this.closeModal();
          }),
      );
    }
  }

  setInitialFolderName(): void {
    const folderName = this.folder?.name;
    if (folderName) {
      this.form.controls.name.setValue(folderName);
    }
  }
}
