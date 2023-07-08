import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TimelineEventTag } from '../../../models/interfaces/timeline-event-tag';
import { TimelineEventNote } from '../../../models/interfaces/timeline-event-note';
import { TimelineEventNotePersonMention } from '../../../models/interfaces/timeline-event-note-person-mention';
import { TrialCaseCardNote } from '../../../models/interfaces/trial-case-card-note';
import { SetOrderItem } from '../../../models/interfaces/set-order-item';
import { SetOrderReqBody } from '../../../models/interfaces/set-order-request-body';
import { UserComment } from '../../../models/interfaces/user-comment';
import { TimelineEventNoteDocument } from '../../../models/interfaces/timeline-event-note-document';
import { guid } from 'odata-query';
import { TimelineEventUserComment } from '../../../models/interfaces/timeline-event-user-comment';

@Injectable({
  providedIn: 'root',
})
export class TimelineEventEntitiesService {

  private _timelineEventTags$ = new BehaviorSubject<TimelineEventTag[] | null>(null);
  private _notes$ = new BehaviorSubject<TimelineEventNote[] | null>(null);
  private _comments$ = new BehaviorSubject<TimelineEventUserComment[] | null>(null);
  get timelineEventTags$(): Observable<TimelineEventTag[] | null> {
    return this._timelineEventTags$
      .asObservable();
  }
  get notes$(): Observable<TimelineEventNote[] | null> {
    return this._notes$
      .asObservable();
  }
  get notes(): TimelineEventNote[] | null {
    return this._notes$.getValue();
  }
  set notes(notes: TimelineEventNote[] | null) {
    this._notes$.next(notes);
  }
  get comments$(): Observable<TimelineEventUserComment[] | null> {
    return this._comments$
      .asObservable();
  }
  set comments(comments: TimelineEventUserComment[] | null) {
    this._comments$.next(comments);
  }
  constructor(
    private backendApiService: BackendApiService,
  ) { }

  createNote(
    timelineEventId: string,
    title: string,
    description: string,
    order: number,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TimelineEventNote> {
    const reqParams = {
      title,
      description,
      order,
      timeLineEventId: timelineEventId,
      personMentions: personMentions as TimelineEventNotePersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TimelineEventNoteDocument[],
      }),
    };

    return this.backendApiService.postEntity<TimelineEventNote>('timelineEventNote', reqParams);
  }

  removeNote(
    noteId: string,
  ): Observable<TimelineEventNote> {
    return this.backendApiService.deleteEntity<TimelineEventNote>('timelineEventNote', noteId);
  }

  updateNote(
    noteId: string,
    title: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TimelineEventNote> {
    const reqParams = {
      title,
      description,
      personMentions: personMentions as TimelineEventNotePersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TimelineEventNoteDocument[],
      }),
    };

    return this.backendApiService.updateEntity<TimelineEventNote>('timelineEventNote', noteId, reqParams);
  }

  updateNotesOrder(
    notes: TimelineEventNote[],
  ): Observable<any> {
    let setOrderItemsList: SetOrderItem[] = [];
    notes.map((item: TimelineEventNote) => setOrderItemsList.push({ id: item.id, order: item.order }));

    const reqParams: SetOrderReqBody = {
      orderModel: [
        ...setOrderItemsList,
      ],
    };

    return this.backendApiService.sortEntities<TrialCaseCardNote>('sortTimelineEventNotes', reqParams);
  }

  createComment(
    timelineEventId: string,
    comment: string,
  ): Observable<UserComment> {
    const reqParams = {
      message: comment,
      timelineEventUserComments: [
        {
          timelineEventId,
        },
      ],
    };

    // TODO: REMOVE ts-ignore
    // @ts-ignore
    return this.backendApiService.postEntity<UserComment>('userComments', reqParams);
  }

  loadNotesByTimelineEventId(
    timelineEventId: string,
  ): Observable<TimelineEventNote[]> {
    this.notes = null;

    return this.backendApiService.getEntitySet<TimelineEventNote>('timelineEventNote', {
      filter: {
        timeLineEventId: guid(timelineEventId),
        isDeleted: false,
      },
      expand: {
        documents: {
          expand: {
            document: {},
          },
        },
      },
    })
      .pipe(
        tap(notes => this.notes = notes),
      );
  }

  loadCommentsByTimelineEventId(
    timelineEventId: string,
  ): Observable<TimelineEventUserComment[]> {
    this.comments = null;

    return this.backendApiService.getEntitySet<TimelineEventUserComment>('timelineEventComment', {
      filter: {
        timeLineEventId: guid(timelineEventId),
      },
      expand: {
        userComment: {
          expand: {
            createdByUser: {},
          },
        },
      },
    })
      .pipe(
        tap(comments => this.comments = comments),
      );
  }
}
