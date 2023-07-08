import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Document } from '../../../../models/interfaces/document';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { saveAs } from 'file-saver';
import { finalize, Subscription } from 'rxjs';
import { File } from '../../../../models/interfaces/file';

@Component({
  selector: 'lr-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentInfoComponent implements OnDestroy {
  @Input() document!: Document;
  submitting = false;
  private _subscription = new Subscription();

  constructor(
    private documentsService: DocumentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get fileName(): string {
    return this.file?.fileName || '';
  }

  get file(): File | null {
    const files = this.document.files.filter(i => !i.file.isDeleted).map(i => i.file);
    return files[0] || null;
  }

  get isExhibit(): boolean {
    return !!this.document.documentParentId;
  }

  downloadFile(): void {
    this.submitting = true;
    if (this.file) {
      this._subscription.add(
        this.documentsService.getFileBlob(this.file.id)
          .pipe(
            finalize(() => {
              this.submitting = false;
              this.cdr.detectChanges();
            }),
          )
          .subscribe(blob => {
            saveAs(blob, this.fileName);
          }),
      );
    }

  }
}
