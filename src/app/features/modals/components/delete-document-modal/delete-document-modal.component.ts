import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../models/interfaces/document';
import { finalize, Subscription, switchMap } from 'rxjs';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lr-delete-document-modal',
  templateUrl: './delete-document-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDocumentModalComponent implements OnDestroy {
  @Input() document!: Document;
  @Input() isExhibit = false;
  submitting = false;
  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private documentsService: DocumentsService,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get containExhibits(): boolean {
    return !!this.document.documents?.length;
  }

  get documentTitle(): string {
    return this.document.title;
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  deleteDocument(): void {
    this.submitting = true;

    this._subscription.add(
      this.documentsService.deleteDocument(this.document.id)
        .pipe(
          switchMap(() => this.documentsService.fetchDocumentFolders()),
          switchMap(() => this.documentsService.fetchAllDocuments(null)),
          finalize(() => this.submitting = false),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Document '${ this.documentTitle }' deleted`);
          this.closeModal();
          this.offcanvasService.dismiss();
          window.history.back();
        }),
    );
  }

}
