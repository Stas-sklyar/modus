import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnModule } from '../../../shared/components/btn/btn.module';
import { Document } from '../../../models/interfaces/document';
import { Router } from '@angular/router';

@Component({
  selector: 'lr-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss'],
  imports: [CommonModule, BtnModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DocumentCardComponent {
  @Input() name = '';
  @Input() document!: Document;

  constructor(
    private router: Router,
  ) {}

  openDocumentPreview(document: Document): void {
    this.router.navigate([], { queryParams: {
      documentId: document.id, backTo: 'Go back',
    } });
  }
}
