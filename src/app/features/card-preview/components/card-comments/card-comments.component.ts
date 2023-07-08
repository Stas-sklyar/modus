import {
  ChangeDetectionStrategy,
  Component,
  Input, OnDestroy, OnInit,
} from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { Subscription } from 'rxjs';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';

@Component({
  selector: 'lr-card-comments',
  templateUrl: './card-comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCommentsComponent implements OnInit, OnDestroy {
  @Input() cardId: string = '';

  comments$ = this.caseEntitiesService.comments$;
  private _subscription = new Subscription();

  constructor(
    private notificationsSrv: NotificationsService,
    private caseEntitiesService: CaseEntitiesService,
  ) { }

  ngOnInit(): void {
    this.loadCommentsByCardId();
  }
  loadCommentsByCardId(): void {
    this._subscription.add(
      this.caseEntitiesService.loadCommentsByCardId(this.cardId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving comments list');
          },
        }),
    );
  }
  addNewComment(comment: string): void {

    if (comment) {
      this._subscription.add(
        this.caseEntitiesService.createComment(this.cardId, comment)
          .subscribe({
            next: () => {
              this.loadCommentsByCardId();
              this.notificationsSrv.notifySuccess('New comment added successfully');
            },
            error: () => this.notificationsSrv.notifyError('Something went wrong! Please try again'),
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
