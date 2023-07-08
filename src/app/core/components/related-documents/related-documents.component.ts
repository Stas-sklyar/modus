import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../../models/interfaces/document';
import { BtnModule } from '../../../shared/components/btn/btn.module';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  DocumentPreviewComponent,
} from '../../../features/document-preview/components/document-preview/document-preview.component';
import { Router } from '@angular/router';

@Component({
  selector: 'lr-related-documents',
  standalone: true,
  imports: [CommonModule, BtnModule],
  templateUrl: './related-documents.component.html',
  styleUrls: ['./related-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedDocumentsComponent {
  @Input() documents: Document[] | null = null;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
  ) {}

  openDocumentPreview(document: Document): void {
    // const offcanvasRef = this.offcanvasService.open(DocumentPreviewComponent, { position: 'end' });
    // offcanvasRef.componentInstance.documentId = document.id;
    // this.router.navigate([], { queryParams: {
    //   documentId: document.id, backTo: 'Go back',
    // }, queryParamsHandling: 'merge' });

    this.router.navigate([], { queryParams: {
      documentId: document.id, backTo: 'Go back',
    } });
  }

}
