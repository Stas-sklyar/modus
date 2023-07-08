import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import { NewStoryItem } from '../../../../models/interfaces/new-story-item';
import { NarrativeStoryItemType } from '../../../../models/enums/narrative-story-item-type';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { EditingStoryItem } from '../../../../models/interfaces/editing-story-item';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { Document } from '../../../../models/interfaces/document';
import { NarrativeStoriesService } from '../../../../core/services/narrative-stories/narrative-stories.service';

@Component({
  selector: 'lr-narrative-story-items',
  templateUrl: './narrative-story-items.component.html',
  styleUrls: ['./narrative-story-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarrativeStoryItemsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() storyId!: string;
  @Input() storyItems: TrialCaseNarrativeStoryItem[] = [];
  indexOfCurrentVisibleStoryItemDropdown: number | null = null;
  indexOfCurrentVisibleChildStoryItemDropdown: number | null = null;
  indexOfCurrentVisibleEditStoryItemForm: number | null = null;
  indexOfCurrentVisibleEditChildStoryItemForm: number | null = null;
  indexOfCurrentVisibleAddStoryItemForm: number | null = null;
  showAddStoryItemForm = false;
  confirmationModalRef?: BsModalRef;
  private _subscription = new Subscription();
  storyItemType!: NarrativeStoryItemType;

  typeOfOpenAddStoryItemForm$: Observable<NarrativeStoryItemType | null> = new Observable((subscriber) => {
    this.caseNarrativeEntitiesService.typeOfOpenAddStoryItemForm$
      .subscribe({
        next: (type) => {
          if (type) {
            if (type === 'allegation') {
              subscriber.next(NarrativeStoryItemType.ALLEGATION);
            }

            if (type === 'fact') {
              subscriber.next(NarrativeStoryItemType.FACT);
            }

            if (type === 'note') {
              subscriber.next(NarrativeStoryItemType.NOTE);
            }
          } else {
            subscriber.next(null);
            this.closeAddStoryItemForm();
          }
        },
      });
  });

  constructor(
    private bsModalService: BsModalService,
    private notificationsSrv: NotificationsService,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private trialCasesService: TrialCasesService,
    private trialCasePeopleService: TrialCasePeopleService,
    private documentsService: DocumentsService,
    private narrativeStoriesService: NarrativeStoriesService,
  ) {
  }

  ngOnInit(): void {
    this.calcVisibilityOfAddStoryItemForm();
  }

  ngOnChanges(): void {
    this.calcVisibilityOfAddStoryItemForm();
  }

  addStoryItem(newStoryItem: NewStoryItem): void {
    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(newStoryItem.description || '');
    const uploadedDocuments = this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));

    this.showAddStoryItemForm = false;
    this.indexOfCurrentVisibleAddStoryItemForm = null;

    this.caseNarrativeEntitiesService.createNarrativeStoryItem(
      this.storyId || '',
      newStoryItem.title || '',
      newStoryItem.description || '',
      newStoryItem.storyItemType,
      newStoryItem.parentStoryItemId || null,
      newStoryItem.order,
      mentionedPeopleList,
      uploadedDocuments || null,
    )
      .subscribe(
        {
          next: () => {
            this.notificationsSrv.notifySuccess('New story item added successfully');
            this.updateStoryItemsOrder(newStoryItem.order);
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        },
      );
  }

  updateStoryItemsOrder(order: number): void {
    const caseId = this.trialCasesService.selectedTrialCase?.id;
    let storyItemsForIncrementOrder = this.storyItems.slice(order);

    if (storyItemsForIncrementOrder.length === 0) {
      this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(this.storyId || '')
        .pipe(
          switchMap(() => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(this.storyId || '')),
          switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(caseId || '')),
        )
        .subscribe();

      return;
    }

    for (let i = 0; i < storyItemsForIncrementOrder.length; i++) {
      storyItemsForIncrementOrder[i].order = storyItemsForIncrementOrder[i].order + 1;
    }

    this.caseNarrativeEntitiesService.updateStoryItemsOrder(storyItemsForIncrementOrder)
      .pipe(
        switchMap(() => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(this.storyId || '')),
        switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(caseId || '')),
      )
      .subscribe();
  }

  editStoryItem(editedStoryItem: EditingStoryItem): void {
    const caseId = this.trialCasesService.selectedTrialCase?.id;
    this.indexOfCurrentVisibleEditStoryItemForm = null;
    this.indexOfCurrentVisibleEditChildStoryItemForm = null;
    const uploadedDocuments = this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));

    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(editedStoryItem.description || '');

    this.caseNarrativeEntitiesService.updateStoryItem(
      editedStoryItem.id,
      editedStoryItem.title,
      editedStoryItem.parentStoryItemId || null,
      editedStoryItem.description || '',
      editedStoryItem.storyItemType,
      mentionedPeopleList,
      uploadedDocuments || null,
    )
      .pipe(
        switchMap(() => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(this.storyId || '')),
        switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(caseId || '')),
      )
      .subscribe({
        next: () => {
          this.notificationsSrv.notifySuccess('Story item edited successfully');
        },
        error: () => {
          this.notificationsSrv.notifyError('Something went wrong! Please try again');
        },
      });
  }

  deleteStoryItem(storyItemId: string): void {
    const caseId = this.trialCasesService.selectedTrialCase?.id;
    this.indexOfCurrentVisibleStoryItemDropdown = null;

    this.caseNarrativeEntitiesService.deleteStoryItem(storyItemId)
      .pipe(
        switchMap(() => this.caseNarrativeEntitiesService.loadStoryItemsByNarrativeStoryId(this.storyId || '')),
        switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(caseId || '')),
      )
      .subscribe({
        next: () => {
          this.notificationsSrv.notifySuccess('Story item removed successfully');
          this.calcVisibilityOfAddStoryItemForm();
        },
        error: () => {
          this.notificationsSrv.notifyError('Something went wrong! Please try again');
        },
      });
  }

  showConfirmationWindow(confirmationModalForDeleteParentStoryItem: TemplateRef<any>): void {
    this.confirmationModalRef = this.bsModalService.show(confirmationModalForDeleteParentStoryItem);
  }

  confirmationOfDeletionCanceled(): void {
    this.confirmationModalRef?.hide();
  }

  confirmationOfDeletionConfirmed(storyItemId: string): void {
    this.confirmationModalRef?.hide();
    this.deleteStoryItem(storyItemId);
  }

  onClickAddStoryItemBtn(index: number, storyItemType: NarrativeStoryItemType): void {
    this.indexOfCurrentVisibleEditStoryItemForm = null;
    this.indexOfCurrentVisibleEditChildStoryItemForm = null;
    this.indexOfCurrentVisibleAddStoryItemForm = index;
    this.storyItemType = storyItemType;
  }

  hideEditChildStoryItemForm(): void {
    this.indexOfCurrentVisibleEditChildStoryItemForm = null;
    this.indexOfCurrentVisibleEditStoryItemForm = null;
  }

  toggleStoryItemDropdown(index: number): void {
    this.indexOfCurrentVisibleChildStoryItemDropdown = null;
    this.indexOfCurrentVisibleStoryItemDropdown = (this.indexOfCurrentVisibleStoryItemDropdown !== null && this.indexOfCurrentVisibleStoryItemDropdown === index) ? null : index;
  }

  toggleChildStoryItemDropdown(childIndex: number, parentIndex: number): void {
    if (this.indexOfCurrentVisibleChildStoryItemDropdown === childIndex) {
      this.indexOfCurrentVisibleStoryItemDropdown = null;
    } else {
      this.indexOfCurrentVisibleStoryItemDropdown = parentIndex;
    }
    this.indexOfCurrentVisibleChildStoryItemDropdown = (this.indexOfCurrentVisibleChildStoryItemDropdown !== null && this.indexOfCurrentVisibleChildStoryItemDropdown === childIndex) ? null : childIndex;
  }

  toggleEditStoryItemForm(index: number): void {
    this.indexOfCurrentVisibleAddStoryItemForm = null;
    this.indexOfCurrentVisibleStoryItemDropdown = null;
    this.indexOfCurrentVisibleEditStoryItemForm = (this.indexOfCurrentVisibleEditStoryItemForm !== null && this.indexOfCurrentVisibleEditStoryItemForm === index) ? null : index;
  }

  toggleEditChildStoryItemForm(childIndex: number, parentIndex: number): void {
    this.indexOfCurrentVisibleAddStoryItemForm = null;
    this.indexOfCurrentVisibleChildStoryItemDropdown = null;
    this.indexOfCurrentVisibleEditStoryItemForm = parentIndex;
    this.indexOfCurrentVisibleEditChildStoryItemForm = (this.indexOfCurrentVisibleEditChildStoryItemForm !== null && this.indexOfCurrentVisibleEditChildStoryItemForm === childIndex) ? null : childIndex;
  }

  calcVisibilityOfAddStoryItemForm(): void {
    if (!this.storyItems.length) {
      this.showAddStoryItemForm = true;
    }
  }

  calcVisibleOfParentStoryItem(parentIndex: number): boolean {
    return parentIndex !== this.indexOfCurrentVisibleEditStoryItemForm
      || (this.indexOfCurrentVisibleEditStoryItemForm === parentIndex && this.indexOfCurrentVisibleEditChildStoryItemForm !== null);
  }

  calcVisibilityOfParentStoryItemDropdown(parentIndex: number): boolean {
    return parentIndex === this.indexOfCurrentVisibleStoryItemDropdown && this.indexOfCurrentVisibleChildStoryItemDropdown === null;
  }

  calcVisibilityOfEditParentStoryItemForm(parentIndex: number): boolean {
    return parentIndex === this.indexOfCurrentVisibleEditStoryItemForm && this.indexOfCurrentVisibleEditChildStoryItemForm === null;
  }

  calcVisibilityOfChildStoryItem(parentIndex: number, childIndex: number): boolean {
    return (childIndex !== this.indexOfCurrentVisibleEditChildStoryItemForm && parentIndex !== this.indexOfCurrentVisibleEditStoryItemForm) || parentIndex !== this.indexOfCurrentVisibleEditStoryItemForm;
  }

  calcVisibilityOfChildStoryItemDropdown(parentIndex: number, childIndex: number): boolean {
    return childIndex === this.indexOfCurrentVisibleChildStoryItemDropdown && parentIndex === this.indexOfCurrentVisibleStoryItemDropdown;
  }

  calcVisibilityOfEditChildStoryItemForm(parentIndex: number, childIndex: number): boolean {
    return childIndex === this.indexOfCurrentVisibleEditChildStoryItemForm && parentIndex === this.indexOfCurrentVisibleEditStoryItemForm;
  }

  getRelatedNoteDocuments(note: any): Document[] | null {
    return note.documents?.map((item: any) => item.document) || null;
  }

  closeAddStoryItemForm(): void {
    this.indexOfCurrentVisibleAddStoryItemForm = null;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
