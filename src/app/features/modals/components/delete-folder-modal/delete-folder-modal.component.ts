import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { finalize, Subscription, switchMap } from 'rxjs';
import { DocumentFolder } from '../../../../models/interfaces/document-folder';
import { WithCounters } from '../../../../models/interfaces/withCounters';

@Component({
  selector: 'lr-delete-folder-modal',
  templateUrl: './delete-folder-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFolderModalComponent implements OnDestroy {
  @Input() folder!: (DocumentFolder & WithCounters);
  submitting = false;
  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private documentsService: DocumentsService,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get containFiles(): boolean {
    return this.folder['documents@odata.count'] > 0;
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  deleteFolder(): void {
    this.submitting = true;
    this._subscription.add(
      this.documentsService.deleteFolder(this.folder.id)
        .pipe(
          switchMap(() => this.documentsService.fetchDocumentFolders()),
          finalize(() => this.submitting = false),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Folder '${ this.folder.name }' deleted`);
          this.closeModal();
        }),
    );
  }
}
