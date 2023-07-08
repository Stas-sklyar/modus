import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';
import {
  TrialCaseNarrativeStoryItemDocument,
} from '../../../../models/interfaces/trial-case-narrative-story-item-document';

@Component({
  selector: 'lr-case-narrative-story-documents',
  templateUrl: './case-narrative-story-documents.component.html',
  styleUrls: ['./case-narrative-story-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeStoryDocumentsComponent implements OnInit, OnDestroy {
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
            this.notificationsSrv.notifyError('An error occurred while receiving documents list');
          },
        }),
    );
  }
  getAllRelatedDocuments(storyItems: TrialCaseNarrativeStoryItem[]): TrialCaseNarrativeStoryItemDocument[] {
    let documents: TrialCaseNarrativeStoryItemDocument[] = [];
    for (let i = 0; i < storyItems.length; i++) {
      documents = documents.concat(storyItems[i].documents);

      for (let j = 0; j < storyItems[i].items.length; j++) {
        documents = documents.concat(storyItems[i].items[j].documents);
      }
    }

    return documents;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
