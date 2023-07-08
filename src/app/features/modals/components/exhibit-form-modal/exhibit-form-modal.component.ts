import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Document } from '../../../../models/interfaces/document';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExhibitForm } from '../../../../models/interfaces/exhibit-form';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { finalize, switchMap, take } from 'rxjs';
import { File as DocFile } from '../../../../models/interfaces/file';

@Component({
  selector: 'lr-exhibit-form-modal',
  templateUrl: './exhibit-form-modal.component.html',
  styleUrls: ['./exhibit-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExhibitFormModalComponent implements OnInit {
  @Input() action: 'create' | 'edit' = 'create';
  @Input() document!: Document;

  submitting = false;
  attachedFile: File | null = null;
  form = new FormGroup<ExhibitForm>({
    parentDocument: new FormControl({ value: '', disabled: true }, Validators.required),
    fileName: new FormControl(null, Validators.required),
    title: new FormControl('', Validators.required),
    exhibitStamp: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  get fileName(): string | null {
    return this.form.controls.fileName.value;
  }
  get file(): DocFile | null {
    const files = this.document.files.filter(i => !i.file.isDeleted).map(i => i.file);
    return files[0] || null;
  }

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private documentsService: DocumentsService,
  ) {}

  ngOnInit(): void {
    if (this.action === 'edit') {
      this.fillExhibitForm();
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createExhibit(): void {
    const {
      title,
      exhibitStamp,
      description,
    } = this.form.value;
    if (title && exhibitStamp && this.attachedFile && this.document.id) {
      this.submitting = true;
      const formData = new FormData();
      formData.append('file', this.attachedFile);
      formData.append('entity.title', title);
      formData.append('entity.batesNumber', exhibitStamp);
      formData.append('entity.description', description || '');
      formData.append('entity.documentParentId', this.document.id);

      this.documentsService.uploadFile(formData)
        .pipe(
          switchMap(() => this.documentsService.fetchAllDocuments(null)),
          switchMap(() => this.documentsService.fetchDocumentFolders()),
          switchMap(() => this.documentsService.fetchDocument(this.document.id || '')),
          take(1),
          finalize(() => this.submitting = false),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Exhibit "${ title }" created`);
          this.closeModal();
        });
    }
  }

  editExhibit(): void {
    const documentId = this.document.id;
    const {
      title,
      exhibitStamp,
      description,
    } = this.form.value;
    if (documentId && title && exhibitStamp) {
      this.submitting = true;
      const formData = new FormData();
      formData.append('entity.title', title);
      formData.append('entity.batesNumber', exhibitStamp);
      formData.append('entity.description', description || '');
      // formData.append('entity.documentParentId', this.document.parent?.id || '');

      if (this.attachedFile) {
        formData.append('file', this.attachedFile);
      }

      this.documentsService.changeDocument(documentId, formData)
        .pipe(
          switchMap(() => this.documentsService.fetchAllDocuments(null)),
          switchMap(() => this.documentsService.fetchDocumentFolders()),
          switchMap(() => this.documentsService.fetchDocument(documentId || '')),
          take(1),
          finalize(() => this.submitting = false),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Exhibit "${ title }" changed`);
          this.closeModal();
        });
    }
  }

  saveUploadedFile(target: EventTarget | null): void {
    const input = target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const fileName = file.name;
      this.form.controls.fileName.setValue(fileName);
      this.attachedFile = file;
    }
  }

  submitForm(): void {
    if (this.action === 'create') {
      this.createExhibit();
    } else {
      this.editExhibit();
    }
  }

  private fillExhibitForm(): void {
    this.form.controls.parentDocument.setValue(this.document.parent?.title || '');
    this.form.controls.fileName.setValue(this.file?.fileName || null);
    this.form.controls.title.setValue(this.document.title);
    this.form.controls.exhibitStamp.setValue(this.document.batesNumber);
    this.form.controls.description.setValue(this.document.description);
  }
}
