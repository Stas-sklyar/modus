import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import {
  CreateNarrativeStoryModalComponent,
} from '../../../modals/components/create-narrative-story-modal/create-narrative-story-modal.component';
import { TrialCaseNarrativeStory } from '../../../../models/interfaces/trial-case-narrative-story';
import {
  SortCaseEntitiesModalComponent,
} from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { NarrativeStoriesService } from '../../../../core/services/narrative-stories/narrative-stories.service';
import { mergeMap, Observable, Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-case-narrative',
  templateUrl: './case-narrative.component.html',
  styleUrls: ['./case-narrative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeComponent implements OnInit {
  selectedCase$ = this.trialCasesService.selectedTrialCase$;
  narrativeStories$ = this.narrativeStoriesService.narrativeStories$;
  filterIsActive = false;
  filteredNarrativeStories: TrialCaseNarrativeStory[] = [];
  private _subscription = new Subscription();

  constructor(
    private trialCasesService: TrialCasesService,
    private bsModalService: BsModalService,
    private narrativeStoriesService: NarrativeStoriesService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.loadNarrativeStories();
  }

  loadNarrativeStories(): void {
    this._subscription.add(
      this.selectedCase$
        .pipe(
          mergeMap((selectedCase) => {
            if (selectedCase) {
              return this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(selectedCase.id || '');
            } else {
              return new Observable<TrialCaseNarrativeStory[]>(subscriber => subscriber.next([]));
            }
          }),
        )
        .subscribe({
          error: (error) => {
            console.error(error);
            this.notificationsService.notifyError('An error occurred when getting the narrative stories events list');
          },
        }),
    );
  }

  openCreateNarrativeStoryModal(): void {
    this.bsModalService.show(CreateNarrativeStoryModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateNarrativeStory,
      keyboard: true,
    });
  }

  filterBySearchQuery(searchQuery: string, srcNarrativeStoriesArr: TrialCaseNarrativeStory[]): void {
    if (searchQuery) {
      this.filterIsActive = true;
      searchQuery = searchQuery.toLowerCase();

      this.filteredNarrativeStories = srcNarrativeStoriesArr.filter(narrativeStory => {
        const searchQueryFoundInNarrativeStory = narrativeStory.title.toLowerCase().includes(searchQuery) || narrativeStory.description?.toLowerCase().includes(searchQuery);
        if (searchQueryFoundInNarrativeStory) return true;

        for (const parentStoryItem of narrativeStory.trialCaseNarrativeStoryItems) {
          const searchQueryFoundInParentStoryItem = parentStoryItem.title.toLowerCase().includes(searchQuery) || parentStoryItem.description?.toLowerCase().includes(searchQuery);
          if (searchQueryFoundInParentStoryItem) return true;

          for (const childStoryItem of parentStoryItem.items) {
            const searchQueryFoundInChildStoryItem = childStoryItem.title.toLowerCase().includes(searchQuery) || childStoryItem.description?.toLowerCase().includes(searchQuery);
            if (searchQueryFoundInChildStoryItem) return true;
          }
        }

        return false;
      });
    } else {
      this.filterIsActive = false;
      this.filteredNarrativeStories = [];
    }
  }

  openSortNarrativeStoriesModal(narrativeStories: unknown[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: narrativeStories || [],
        trialCaseId,
        title: 'Sort narrative stories',
        fieldName: 'title',
        sortType: SortTypeEnum.SORT_NARRATIVE_STORIES,
      },
      keyboard: true,
    });
  }
}
