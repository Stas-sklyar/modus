import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges, OnDestroy, OnInit,
  SimpleChanges,
} from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { Subscription, switchMap, take } from 'rxjs';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { NewNote } from '../../../../models/interfaces/new-note';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { EditingNote } from '../../../../models/interfaces/editing-note';
import { DocumentsService } from '../../../../core/services/documents/documents.service';

@Component({
  selector: 'lr-card-notes',
  templateUrl: './card-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardNotesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedAddContentMenuItemType: string | null = null;
  @Input() cardId = '';
  private _subscription = new Subscription();
  showAddNoteFormState: 'open' | 'close' = 'close';
  notes$ = this.caseEntitiesService.notes$;

  constructor(
    private notificationsSrv: NotificationsService,
    private caseEntitiesService: CaseEntitiesService,
    private trialCasePeopleService: TrialCasePeopleService,
    private documentsService: DocumentsService,
  ) { }

  ngOnInit(): void {
    this.loadNotesByCardId();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const selectedMenuItemTypeCurrentValue = changes['selectedAddContentMenuItemType']?.currentValue;
    if (selectedMenuItemTypeCurrentValue === 'general') {
      this.showAddNoteFormState = 'open';
    }
  }

  loadNotesByCardId(): void {
    this._subscription.add(
      this.caseEntitiesService.loadNotesByCardId(this.cardId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving notes list');
          },
        }),
    );
  }

  addNote(noteBody: NewNote): void {
    // TODO: FIX CONDITION AFTER API FIX (DOCUMENTS)
    if (noteBody.title || true) {
      const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(noteBody.description || '');
      const uploadedDocuments = this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));
      const order = noteBody.order;

      this._subscription.add(
        this.caseEntitiesService.createNote(
          this.cardId,
          noteBody.title || '',
          noteBody.description || '',
          order,
          mentionedPeopleList,
          uploadedDocuments || null,
        )
          .subscribe(
            {
              next: () => {
                this.notificationsSrv.notifySuccess('New note added successfully');
                this.updateNotesOrder(order);
              },
              error: () => {
                this.notificationsSrv.notifyError('Something went wrong! Please try again');
              },
            },
          ),
      );
    } else {
      this.notificationsSrv.notifyError('Please enter title');
    }
  }

  deleteNote(noteId: string): void {
    this._subscription.add(
      this.caseEntitiesService.deleteCardNote(noteId)
        .pipe(
          switchMap(() => this.caseEntitiesService.loadNotesByCardId(this.cardId)),
          take(1),
        )
        .subscribe({
          next: () => {
            this.notificationsSrv.notifySuccess('Note removed successfully');
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        }),
    );
  }

  editNote(editedNote: EditingNote): void {
    if (!editedNote.title) {
      this.notificationsSrv.notifyError('Title is required!');
      return;
    }
    const uploadedDocuments = this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));

    this._subscription.add(
      this.caseEntitiesService.updateCardNote(
        editedNote.id,
        editedNote.title,
        editedNote.description || '',
        editedNote.personMentions,
        uploadedDocuments || null,
      )
        .pipe(
          switchMap(() => this.caseEntitiesService.loadNotesByCardId(this.cardId)),
          take(1),
        )
        .subscribe({
          next: () => {
            this.notificationsSrv.notifySuccess('Note edited successfully');
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        }),
    );
  }

  updateNotesOrder(indexOfCurrentAddedNote: number): void {
    if (indexOfCurrentAddedNote === 0) {
      this.loadNotesByCardId();
      return;
    }

    let notesForIncrementOrder = this.caseEntitiesService.notes?.slice(indexOfCurrentAddedNote) || [];

    for (let i = 0; i < notesForIncrementOrder.length; i++) {
      notesForIncrementOrder[i].order = notesForIncrementOrder[i].order + 1;
    }

    this._subscription.add(
      this.caseEntitiesService.updateCardNotesOrder(notesForIncrementOrder)
        .pipe(
          switchMap(() => this.caseEntitiesService.loadNotesByCardId(this.cardId)),
          take(1),
        )
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
