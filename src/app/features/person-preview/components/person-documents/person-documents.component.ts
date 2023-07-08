import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lr-person-documents',
  templateUrl: './person-documents.component.html',
  styleUrls: ['./person-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDocumentsComponent {
  @ViewChild('uploadDocumentSection') uploadDocumentSection: ElementRef | null = null;
  uploadDocumentSectionIsActive: boolean = false;

  openUploadDocumentSection(): void {
    this.uploadDocumentSectionIsActive = !this.uploadDocumentSectionIsActive;

    if (this.uploadDocumentSectionIsActive) {
      setTimeout(() => {
        this.uploadDocumentSection?.nativeElement.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' } );
      }, 0);
    }

  }
}
