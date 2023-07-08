import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TimelineEventEntitiesService } from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { NewNote } from '../../../../models/interfaces/new-note';
import { EditingNote } from '../../../../models/interfaces/editing-note';
import { DocumentsService } from '../../../../core/services/documents/documents.service';

@Component({
  selector: 'lr-timeline-event-notes',
  templateUrl: './timeline-event-notes.component.html',
  styleUrls: ['./timeline-event-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventNotesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() timelineEventId: string = '';
  @Input() selectedAddContentMenuItemType: string | null = null;
  @ViewChild('addNoteSection') addNoteSection: ElementRef | null = null;
  notes$ = this.timelineEventEntitiesService.notes$;
  private _subscription = new Subscription();
  showAddNoteFormState: 'open' | 'close' = 'close';

  constructor(
    private notificationsSrv: NotificationsService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
    private timelineEventsService: TimelineEventsService,
    private trialCasePeopleService: TrialCasePeopleService,
    private documentsService: DocumentsService,
  ) { }

  ngOnInit(): void {
    this.loadNotesByEventId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedMenuItemType = changes['selectedAddContentMenuItemType']?.currentValue;
    if (selectedMenuItemType === 'general') {
      this.showAddNoteFormState = 'open';
    }
  }

  loadNotesByEventId(): void {
    this._subscription.add(
      this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.timelineEventId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving notes list');
          },
        }),
    );
  }

  addNote(noteBody: NewNote): void {

    // TODO: FIX CONDITION AFTER API FIX (DOCUMENTS)
    if (noteBody.title || noteBody.description || true) {
      const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(noteBody.description || '');
      const uploadedDocuments = this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));
      const order = noteBody.order;

      this._subscription.add(
        this.timelineEventEntitiesService.createNote(
          this.timelineEventId,
          noteBody.title || '',
          noteBody.description || '',
          order,
          mentionedPeopleList,
          uploadedDocuments || null,
        )
          .subscribe({
            next: () => {
              this.notificationsSrv.notifySuccess('New note added successfully');
              this.updateNotesOrder(order);
            },
            error: () => {
              this.notificationsSrv.notifyError('Something went wrong! Please try again');
            },
          }),
      );
    }
  }

  deleteNote(noteId: string): void {
    this._subscription.add(
      this.timelineEventEntitiesService.removeNote(noteId)
        .pipe(
          switchMap(() => this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.timelineEventId)),
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
      this.timelineEventEntitiesService.updateNote(
        editedNote.id,
        editedNote.title,
        editedNote.description || '',
        editedNote.personMentions,
        uploadedDocuments || null,
      )
        .pipe(
          switchMap(() => this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.timelineEventId)),
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

  updateNotesOrder(order: number): void {
    if (order === 0) {
      this.loadNotesByEventId();
      return;
    } else {
      let notesForIncrementOrder = this.timelineEventEntitiesService.notes?.slice(order) || [];

      for (let i = 0; i < notesForIncrementOrder.length; i++) {
        notesForIncrementOrder[i].order = notesForIncrementOrder[i].order + 1;
      }

      this._subscription.add(
        this.timelineEventEntitiesService.updateNotesOrder(notesForIncrementOrder)
          .pipe(
            switchMap(() => this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.timelineEventId)),
            take(1),
          )
          .subscribe({
            error: () => {
              this.notificationsSrv.notifyError('Something went wrong! Please try again');
            },
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
