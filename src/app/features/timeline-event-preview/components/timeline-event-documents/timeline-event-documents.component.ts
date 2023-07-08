import {
  ChangeDetectionStrategy,
  Component,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TimelineEventEntitiesService } from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';
import { TimelineEventNote } from '../../../../models/interfaces/timeline-event-note';
import { TimelineEventNoteDocument } from '../../../../models/interfaces/timeline-event-note-document';

@Component({
  selector: 'lr-timeline-event-documents',
  templateUrl: './timeline-event-documents.component.html',
  styleUrls: ['./timeline-event-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventDocumentsComponent implements OnInit, OnDestroy {
  @Input() eventId: string = '';
  private _subscription = new Subscription();
  notes$ = this.timelineEventEntitiesService.notes$;

  constructor(
    private notificationsSrv: NotificationsService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
  ) { }
  ngOnInit(): void {
    this.loadNotesByEventId();
  }

  loadNotesByEventId(): void {
    this._subscription.add(
      this.timelineEventEntitiesService.loadNotesByTimelineEventId(this.eventId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving documents list');
          },
        }),
    );
  }

  getRelatedDocuments(notes: TimelineEventNote[]): TimelineEventNoteDocument[] {
    let documents: TimelineEventNoteDocument[] = [];

    for (let i = 0; i < notes.length; i++) {
      documents = documents.concat(notes[i].documents);
    }

    return documents;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
