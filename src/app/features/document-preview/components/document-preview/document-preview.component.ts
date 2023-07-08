import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, of, Subscription, switchMap, tap } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { Modal } from '../../../../models/enums/modal';
import { Document } from '../../../../models/interfaces/document';
import { ExhibitFormModalComponent } from '../../../modals/components/exhibit-form-modal/exhibit-form-modal.component';
import { DocumentFormModalComponent } from '../../../modals/components/document-form-modal/document-form-modal.component';
import {
  DeleteDocumentModalComponent,
} from '../../../modals/components/delete-document-modal/delete-document-modal.component';
import { ActivatedRoute } from '@angular/router';

type Category = 'general' | 'exhibits' | 'comments';

@Component({
  selector: 'lr-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPreviewComponent implements OnInit, OnDestroy {
  documentId: string | null = null;
  backTo: string | null = null;
  selectedDocument$ = this.documentsService.selectedDocument$;
  selectedCategory$ = new BehaviorSubject<Category | null>(null);
  private _subscription = new Subscription();

  constructor(
    private bsModalService: BsModalService,
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.listenToQueryParams();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.documentsService.selectedDocument = null;
  }

  closePanel(): void {
    window.history.back();
  }

  openEditDocumentDocumentModal(document: Document): void {
    if (this.isExhibit(document)) {
      this.bsModalService.show(ExhibitFormModalComponent, {
        class: 'modal-dialog-centered',
        id: Modal.Exhibit,
        initialState: {
          document,
          action: 'edit',
        },
        keyboard: true,
      });
    } else {
      this.bsModalService.show(DocumentFormModalComponent, {
        class: 'modal-dialog-centered',
        id: Modal.Document,
        initialState: {
          document,
          action: 'edit',
        },
        keyboard: true,
      });
    }
  }

  openDeleteDocumentDocumentModal(document: Document): void {
    const isExhibit = this.isExhibit(document);

    this.bsModalService.show(DeleteDocumentModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.DeleteDocument,
      initialState: {
        document,
        isExhibit,
      },
      keyboard: true,
    });
  }

  openExhibitModal(document: Document): void {
    this.bsModalService.show(ExhibitFormModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.AddExhibit,
      initialState: {
        document,
      },
      keyboard: true,
    });
  }

  isExhibit(document: Document): boolean {
    return !!document.documentParentId;
  }

  private listenToQueryParams(): void {
    this._subscription.add(
      this.route.queryParamMap
        .pipe(
          tap((params) => {
            this.documentId = params.get('documentId');
            this.backTo = params.get('backTo');
          }),
          switchMap((params) => {
            const documentId = params.get('documentId');
            return documentId ? this.documentsService.fetchDocument(documentId) : of(null);
          }),
        )
        .subscribe(() => {
          this.setInitialCategory();
        }),
    );
  }

  private setInitialCategory(): void {
    this.selectedCategory$.next('general');
  }
}
