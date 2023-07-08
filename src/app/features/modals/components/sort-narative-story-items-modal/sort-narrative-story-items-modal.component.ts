import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DraggableItemService } from 'ngx-bootstrap/sortable';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { NgIf, NgStyle } from '@angular/common';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { NarrativeStoriesService } from '../../../../core/services/narrative-stories/narrative-stories.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { ModalsModule } from '../../modals.module';

@Component({
  selector: 'lr-sort-narrative-story-items-modal',
  templateUrl: './sort-narrative-story-items-modal.component.html',
  providers: [DraggableItemService],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SortableModule,
    NgIf,
    NgStyle,
    ModalsModule,
  ],
})
export class SortNarrativeStoryItemsModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() storyItems: TrialCaseNarrativeStoryItem[] = [];
  sortedStoryItems: TrialCaseNarrativeStoryItem[] = [];

  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private narrativeStoriesService: NarrativeStoriesService,
    private trialCasesService: TrialCasesService,
  ) {
  }

  ngOnInit(): void {
    this.sortedStoryItems = this.storyItems;
  }

  ngOnChanges(): void {
    this.sortedStoryItems = this.storyItems;
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  sortEntities(): void {
    let fixedStoryItemsArr = this.storyItems;

    for (let i = 0; i < fixedStoryItemsArr.length; i++) {
      fixedStoryItemsArr[i].order = i;

      if (fixedStoryItemsArr[i].items?.length) {
        for (let j = 0; j < fixedStoryItemsArr[i].items.length; j++) {
          fixedStoryItemsArr[i].items[j].order = j;
          fixedStoryItemsArr[i].items[j].trialCaseNarrativeStoryItemId = fixedStoryItemsArr[i].id;
        }
      }
    }


    let storyItemsArrForSort = [];

    for (let i = 0; i < fixedStoryItemsArr.length; i++) {
      storyItemsArrForSort.push({
        id: fixedStoryItemsArr[i].id,
        trialCaseNarrativeStoryItemId: fixedStoryItemsArr[i].trialCaseNarrativeStoryItemId,
        order: fixedStoryItemsArr[i].order,
      });

      if (fixedStoryItemsArr[i].items?.length) {
        for (let j = 0; j < fixedStoryItemsArr[i].items.length; j++) {
          storyItemsArrForSort.push({
            id: fixedStoryItemsArr[i].items[j].id,
            trialCaseNarrativeStoryItemId: fixedStoryItemsArr[i].items[j].trialCaseNarrativeStoryItemId,
            order: fixedStoryItemsArr[i].items[j].order,
          });
        }
      }
    }

    const selectedStoryId = this.caseNarrativeEntitiesService.selectedNarrativeStory?.id;
    const selectedTrialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this._subscription.add(
      this.caseNarrativeEntitiesService.sortStoryItems(storyItemsArrForSort)
        .pipe(
          switchMap(() => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(selectedStoryId || '')),
          switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(selectedTrialCaseId || '')),
        )
        .subscribe({
          next: () => {
            this.notificationsService.notifySuccess('Story items successfully sorted');
            this.closeModal();
          },
          error: () => {
            this.notificationsService.notifyError('Something went wrong. Please, try again');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
