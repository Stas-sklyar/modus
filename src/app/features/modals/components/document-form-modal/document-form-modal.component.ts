import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentForm } from '../../../../models/interfaces/document-form';
import { Document } from '../../../../models/interfaces/document';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { DocumentFolder } from '../../../../models/interfaces/document-folder';
import { DocumentFolderForm } from '../../../../models/interfaces/document-folder-form';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { combineLatest, finalize, map, startWith, Subscription, switchMap, take, tap } from 'rxjs';
import { File as DocFile } from '../../../../models/interfaces/file';

@Component({
  selector: 'lr-document-form-modal',
  templateUrl: './document-form-modal.component.html',
  styleUrls: ['./document-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFormModalComponent implements OnInit, OnDestroy {
  @Input() action: 'create' | 'edit' = 'create';
  @Input() document!: Document;
  @Output() passBack = new EventEmitter<Document | null>();
  folders$ = this.documentsService.documentFolders$;
  showAddFolderForm = false;
  selectedFolderName = new FormControl('');
  get folderName(): string {
    return this.selectedFolderName.value || '';
  }
  set folderName(value: string) {
    this.selectedFolderName.setValue(value);
  }
  attachedFile: File | null = null;
  documentForm = new FormGroup<DocumentForm>({
    folderId: new FormControl(null, Validators.required),
    fileName: new FormControl(null, Validators.required),
    title: new FormControl('', Validators.required),
    batesNumber: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  folderForm = new FormGroup<DocumentFolderForm>({
    name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
  });
  submitting = false;
  get fileName(): string | null {
    return this.documentForm.controls.fileName.value;
  }
  get file(): DocFile | null {
    const files = this.document.files.filter(i => !i.file.isDeleted).map(i => i.file);
    return files[0] || null;
  }
  private _subscription = new Subscription();
  filteredFolders$ = combineLatest([
    this.folders$,
    this.selectedFolderName.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([folders, folderName]) => this.foldersFilter(folders, folderName || '')),
  );

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private documentsService: DocumentsService,
    private trialCaseService: TrialCasesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._subscription.add(
      this.documentsService.fetchDocumentFolders().subscribe(() => {
        if (this.action === 'edit') {
          this.fillDocumentForm();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  isExhibit(document: Document): boolean {
    return !!document.documentParentId;
  }

  submitForm(): void {
    if (this.action === 'create') {
      this.createDocument();
    } else {
      this.editDocument();
    }
  }

  createDocument(): void {
    const {
      folderId,
      title,
      batesNumber,
      description,
    } = this.documentForm.value;
    if (folderId && title && batesNumber && this.attachedFile) {
      this.submitting = true;
      const formData = new FormData();
      formData.append('file', this.attachedFile);
      formData.append('entity.documentFolderId', folderId);
      formData.append('entity.title', title);
      formData.append('entity.batesNumber', batesNumber);
      formData.append('entity.description', description || '');

      this.documentsService.uploadFile(formData)
        .pipe(
          tap((document) => this.passBack.emit(document)),
          switchMap(() => this.documentsService.fetchAllDocuments(null)),
          switchMap(() =>  this.documentsService.fetchDocumentFolders()),
          finalize(() => {
            this.submitting = false;
          }),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Document "${ title }" created`);
          this.closeModal();
        });
    }
  }

  editDocument(): void {
    const documentId = this.document.id;
    const {
      folderId,
      title,
      batesNumber,
      description,
    } = this.documentForm.value;
    if (documentId && folderId && title && batesNumber) {
      this.submitting = true;
      const formData = new FormData();
      formData.append('entity.documentFolderId', folderId);
      formData.append('entity.title', title);
      formData.append('entity.batesNumber', batesNumber);
      formData.append('entity.description', description || '');

      if (this.attachedFile) {
        formData.append('file', this.attachedFile);
      }

      this.documentsService.changeDocument(documentId, formData)
        .pipe(
          switchMap(() => this.documentsService.fetchAllDocuments(null)),
          switchMap(() => this.documentsService.fetchDocumentFolders()),
          switchMap(() => this.documentsService.fetchDocument(documentId)),
          take(1),
          finalize(() => this.submitting = false),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess(`Document "${ title }" changed`);
          this.closeModal();
        });
    }
  }

  createFolder(): void {
    const { name } = this.folderForm.value;
    const trialCaseId = this.trialCaseService.selectedTrialCase?.id;

    if (name && trialCaseId) {
      this.submitting = true;
      this._subscription.add(
        this.documentsService.createFolder(trialCaseId, name)
          .pipe(
            tap((newFolder) => {
              this.selectFolderId(newFolder.id);
              this.selectedFolderName.setValue(newFolder.name);
            }),
            switchMap(() => this.documentsService.fetchDocumentFolders()),
            take(1),
            finalize(() => this.submitting = false),
          )
          .subscribe(() => {
            this.notificationsService.notifySuccess(`Folder '${ name }' created`);
            this.folderForm.reset();
            this.showAddFolderForm = false;
            this.cdr.detectChanges();
          }),
      );
    }
  }

  saveUploadedFile(target: EventTarget | null): void {
    const input = target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const fileName = file.name;
      this.documentForm.controls.fileName.setValue(fileName);
      this.attachedFile = file;
    }
  }

  selectFolderId(folderId: string): void {
    this.documentForm.get('folderId')?.setValue(folderId);
  }

  private fillDocumentForm(): void {
    this.selectedFolderName.setValue(this.initialFolderName);
    this.documentForm.controls.folderId.setValue(this.document.documentFolderId);
    this.documentForm.controls.fileName.setValue(this.file?.fileName || null);
    this.documentForm.controls.title.setValue(this.document.title);
    this.documentForm.controls.batesNumber.setValue(this.document.batesNumber);
    this.documentForm.controls.description.setValue(this.document.description);
  }

  private get initialFolderName(): string {
    return this.documentsService.documentFolders?.find(folder => folder.id === this.document.documentFolderId)?.name || '';
  }

  private foldersFilter(folders: DocumentFolder[] | null, folderName: string): DocumentFolder[] {
    if (!folders) return [];
    // const filterValue = this.normalizeValue(folderName);
    // return folders.filter(folder => this.normalizeValue(folder.name).includes(filterValue));
    return folders;
  }

  private normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
