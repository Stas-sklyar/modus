import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsService } from '../../services/documents/documents.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  DocumentFormModalComponent,
} from '../../../features/modals/components/document-form-modal/document-form-modal.component';
import { Modal } from '../../../models/enums/modal';
import { Subscription } from 'rxjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Document } from '../../../models/interfaces/document';
import { BtnModule } from '../../../shared/components/btn/btn.module';

@Component({
  selector: 'lr-documents-buffer',
  standalone: true,
  imports: [CommonModule, BsDropdownModule, MatAutocompleteModule, ReactiveFormsModule, BtnModule],
  templateUrl: './documents-buffer.component.html',
  styleUrls: ['./documents-buffer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsBufferComponent implements OnInit, OnDestroy {
  @Input() dropUp = false;

  selectedDocumentName = new FormControl('');
  documents$ = this.documentsService.documents$;
  uploadedDocuments$ = this.documentsService.uploadedDocumentsBuffer$;
  private _subscription = new Subscription();

  constructor(
    private documentsService: DocumentsService,
    private bsModalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this._subscription.add(
      this.documentsService.fetchAllDocuments(null).subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.documentsService.uploadedDocumentsBuffer = null;
  }

  openDocumentModal(): void {
    const modal = this.bsModalService.show(DocumentFormModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.Document,
      initialState: {
        action: 'create',
      },
      keyboard: true,
      ignoreBackdropClick: true,
    });
    this.listenToDocumentUpload(modal);
  }

  selectDocument(document: Document): void {
    this.addDocumentToBuffer(document);
    this.selectedDocumentName.reset();
  }

  private addDocumentToBuffer(document: Document | null): void {
    const collection = this.documentsService.uploadedDocumentsBuffer || [];
    const alreadyExist = collection.find(i => i.id === document?.id);
    if (document && !alreadyExist) {
      this.documentsService.uploadedDocumentsBuffer = collection.concat(document);
    }
  }

  private listenToDocumentUpload(ref: BsModalRef<DocumentFormModalComponent>): void {
    this._subscription.add(
      ref.content?.passBack.subscribe(document => {
        this.addDocumentToBuffer(document);
      }),
    );
  }

}
