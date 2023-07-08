import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { Subscription, switchMap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-case-narrative-story-general',
  templateUrl: './case-narrative-story-general.component.html',
  styleUrls: ['./case-narrative-story-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeStoryGeneralComponent implements OnInit, OnDestroy {
  @Input() storyId!: string;
  storyItems$ = this.caseNarrativeEntitiesService.storyItems$;
  private _subscription = new Subscription();

  constructor(
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private notificationsSrv: NotificationsService,
  ) {
  }
  ngOnInit(): void {
    this.loadStoryItemsByNarrativeStoryId();
  }

  loadStoryItemsByNarrativeStoryId(): void {
    this._subscription.add(
      this.caseNarrativeEntitiesService.selectedNarrativeStory$
        .pipe(
          switchMap((selectedNarrativeStory) => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(selectedNarrativeStory?.id || '')),
        )
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving story items list');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
