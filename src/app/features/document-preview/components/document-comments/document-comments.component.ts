import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { Document } from '../../../../models/interfaces/document';

@Component({
  selector: 'lr-document-comments',
  templateUrl: './document-comments.component.html',
  styleUrls: ['./document-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCommentsComponent implements OnDestroy {
  @Input() document!: Document;
  comment = new FormControl('', Validators.required);
  private _subscription = new Subscription();

  constructor(
    private documentsService: DocumentsService,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  addComment(): void {
    const comment = this.comment.value;
    if (comment) {
      this._subscription.add(
        this.documentsService.createComment(this.document.id, comment)
          .pipe(
            switchMap(() => this.documentsService.fetchDocument(this.document.id)),
            take(1),
          )
          .subscribe(() => {
            this.comment.reset();
          }),
      );
    }
  }
}
