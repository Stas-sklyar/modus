import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCommentFormComponent } from '../add-comment-form/add-comment-form.component';
import { Subscription } from 'rxjs';
import TimeAgo from 'javascript-time-ago';

@Component({
  selector: 'lr-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AddCommentFormComponent],
})

export class CommentsComponent implements OnDestroy {
  @Input() comments: any[] = [];
  @Output() addCommentEvent = new EventEmitter<string>();
  timeAgo = new TimeAgo('en-US');
  private _subscription = new Subscription();

  addNewComment(comment: string): void {
    this.addCommentEvent.emit(comment);
  }

  calcCommentDate(date: string): string {
    return this.timeAgo.format(new Date(date));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
