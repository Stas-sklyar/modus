import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TimelineEventEntitiesService } from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';

@Component({
  selector: 'lr-timeline-event-comments',
  templateUrl: './timeline-event-comments.component.html',
  styleUrls: ['./timeline-event-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventCommentsComponent implements OnInit, OnDestroy {
  @Input() timelineEventId: string = '';
  comments$ = this.timelineEventEntitiesService.comments$;
  private _subscription = new Subscription();
  constructor(
    private notificationsSrv: NotificationsService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
    private timelineEventsService: TimelineEventsService,
  ) { }

  ngOnInit(): void {
    this.loadCommentsByEventId();
  }

  loadCommentsByEventId(): void {
    this._subscription.add(
      this.timelineEventEntitiesService.loadCommentsByTimelineEventId(this.timelineEventId)
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
        this.timelineEventEntitiesService.createComment(this.timelineEventId, comment)
          .pipe(
            switchMap(() => this.timelineEventEntitiesService.loadCommentsByTimelineEventId(this.timelineEventId)),
            take(1),
          )
          .subscribe({
            next: () => this.notificationsSrv.notifySuccess('New comment added successfully'),
            error: () => this.notificationsSrv.notifyError('Something went wrong! Please try again'),
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
