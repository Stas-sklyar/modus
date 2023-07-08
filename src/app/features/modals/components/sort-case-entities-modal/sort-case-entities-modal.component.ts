import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DraggableItemService } from 'ngx-bootstrap/sortable';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { TrialCaseCardNote } from '../../../../models/interfaces/trial-case-card-note';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';
import {
  TimelineEventEntitiesService,
} from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';
import { NarrativeStoriesService } from '../../../../core/services/narrative-stories/narrative-stories.service';

@Component({
  selector: 'lr-sort-case-entities-modal',
  templateUrl: './sort-case-entities-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DraggableItemService],
})
export class SortCaseEntitiesModalComponent implements OnInit, OnDestroy {
  @Input() entities: any[] = [];
  @Input() trialCaseId!: string;
  @Input() timelineEventId!: string;
  @Input() title!: string;
  @Input() fieldName!: string;
  @Input() sortType!: SortTypeEnum;
  sortedEntities: any[] = [];

  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private caseEntitiesService: CaseEntitiesService,
    private notificationsSrv: NotificationsService,
    private trialCasesService: TrialCasesService,
    private trialNotebookService: TrialNotebookService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
    private narrativeStoriesService: NarrativeStoriesService,
  ) {
  }

  ngOnInit(): void {
    // TODO: REMOVE ts-ignore
    // @ts-ignore
    this.sortedEntities = this.entities.filter(item => !item.isDeleted);
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  sortEntities(): void {
    this._subscription.add(
      this.caseEntitiesService.sortCaseEntities(this.sortedEntities, this.sortType).subscribe(
        {
          next: () => {

            switch (this.sortType) {
              case SortTypeEnum.SORT_CARD_NOTES:
                this.updateCardData();
                break;

              case SortTypeEnum.SORT_NOTEBOOK_CARDS:
                this.updateNotebookData();
                break;

              case SortTypeEnum.SORT_NOTEBOOK_SECTIONS:
                this.updateNotebookData();
                break;

              case SortTypeEnum.SORT_TIMELINE_EVENT_NOTES:
                this.updateTimelineData();
                break;

              case SortTypeEnum.SORT_FOLDERS:
                this.updateFoldersList();
                break;

              case SortTypeEnum.SORT_SECTIONS:
                this.updateFoldersList();
                break;

              case SortTypeEnum.SORT_SUBSECTIONS:
                this.updateSubsectionsList();
                break;

              case SortTypeEnum.SORT_CARDS:
                this.updateSubsectionsList();
                break;

              case SortTypeEnum.SORT_NARRATIVE_STORIES:
                this.updateNarrativeStoriesList();
                break;

              default:
                this.updateCaseData();
                break;
            }
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong, please try again');
          },
        },
      ),
    );
  }

  updateCaseData(): void {
    this._subscription.add(
      this.trialCasesService.loadFullDataByTrialCase(this.trialCaseId || '').subscribe({
        next: () => {
          this.closeModal();
          this.notificationsSrv.notifySuccess('Sorting was successful');
        },
        error: () => {
          this.notificationsSrv.notifyError('An error occurred when receiving trial case data, please reload the page');
        },
      }),
    );
  }

  updateCardData(): void {
    const note = this.entities[0] as TrialCaseCardNote;
    const cardId = note.cardId;

    this._subscription.add(
      this.caseEntitiesService.loadNotesByCardId(cardId || '')
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsSrv.notifySuccess('Notes successfully sorted');
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred when updating card notes list, please reload the page');
          },
        }),
    );
  }

  updateFoldersList(): void {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id;

    this._subscription.add(
      this.caseEntitiesService.loadFoldersByTrialCaseId(selectedCaseId || '')
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsSrv.notifySuccess('Sorting was successful');
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred when updating folders list, please reload the page');
          },
        }),
    );
  }

  updateSubsectionsList(): void {
    const selectedSectionId = this.caseEntitiesService.selectedSection?.id;

    this._subscription.add(
      this.caseEntitiesService.loadSubsectionsBySectionId(selectedSectionId || '')
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsSrv.notifySuccess('Sorting was successful');
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred when updating subsections list, please reload the page');
          },
        }),
    );
  }

  updateNotebookData(): void {
    this._subscription.add(
      this.trialNotebookService.fetchSections().subscribe({
        next: () => {
          this.closeModal();
          this.notificationsSrv.notifySuccess('Sorting was successful');
        },
        error: () => {
          this.notificationsSrv.notifyError('An error occurred when updating trial notebook data, please reload the page');
        },
      }),
    );
  }

  updateTimelineData(): void {
    this._subscription.add(
      this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.timelineEventId)
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsSrv.notifySuccess('Sorting was successful');
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred when updating timeline events list, please reload the page');
          },
        }),
    );
  }

  updateNarrativeStoriesList(): void {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id;

    this._subscription.add(
      this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(selectedCaseId || '')
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsSrv.notifySuccess('Sorting was successful');
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred when updating narrative stories list, please reload the page');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
