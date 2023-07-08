import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-case-narrative-story-comments',
  templateUrl: './case-narrative-story-comments.component.html',
  styleUrls: ['./case-narrative-story-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeStoryCommentsComponent implements OnInit, OnDestroy {
  @Input() storyId!: string;
  comments$ = this.caseNarrativeEntitiesService.comments$;
  private _subscription = new Subscription();

  constructor(
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private notificationsSrv: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.loadCommentsByNarrativeStoryId();
  }

  loadCommentsByNarrativeStoryId(): void {
    this._subscription.add(
      this.caseNarrativeEntitiesService.loadCommentsByNarrativeStoryId(this.storyId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving comments list');
          },
        }),
    );
  }
  addNewComment(comment: string): void {
    this._subscription.add(
      this.caseNarrativeEntitiesService.createComment(this.storyId, comment)
        .pipe(
          switchMap(() => this.caseNarrativeEntitiesService.loadCommentsByNarrativeStoryId(this.storyId)),
          take(1),
        )
        .subscribe({
          next: () => this.notificationsSrv.notifySuccess('New comment added successfully'),
          error: () => this.notificationsSrv.notifyError('Something went wrong! Please try again'),
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
