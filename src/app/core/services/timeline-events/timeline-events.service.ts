import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';
import { PartyTypeEnum } from '../../../models/enums/party-type';
import { TimelineEventPersonMention } from '../../../models/interfaces/timeline-event-person-mention';
import { guid } from 'odata-query';
import { FilterEventsByPartyTypeForm } from '../../../models/interfaces/filter-events-by-party-type-form';

@Injectable({
  providedIn: 'root',
})
export class TimelineEventsService {
  private _selectedTimelineEvent$ = new BehaviorSubject<TimelineEvent | null>(null);
  private _timelineEvents$ = new BehaviorSubject<TimelineEvent[] | null>(null);
  private _searchQuery$ = new BehaviorSubject<string | null>(null);
  private _selectedIssuesIdArr$ = new BehaviorSubject<string[] | null>(null);
  private _selectedPeopleIdArr$ = new BehaviorSubject<string[] | null>(null);
  private _selectedPartyTypes$ = new BehaviorSubject<FilterEventsByPartyTypeForm>({
    defencePartyTypeSwitchIsActive: true,
    plaintiffPartyTypeSwitchIsActive: true,
    otherPartyTypeSwitchIsActive: true,
  });
  get timelineEvents$(): Observable<TimelineEvent[] | null> {
    return this._timelineEvents$
      .asObservable();
  }
  set timelineEvents(timelineEvents: TimelineEvent[] | null) {
    this._timelineEvents$.next(timelineEvents);
  }
  get selectedTimelineEvent$(): Observable<TimelineEvent | null> {
    return this._selectedTimelineEvent$
      .asObservable();
  }
  set selectedTimelineEvent(
    newTimelineEvent: TimelineEvent | null,
  ) {
    this._selectedTimelineEvent$.next(newTimelineEvent);
  }

  get searchQuery$(): Observable<string | null> {
    return this._searchQuery$.asObservable();
  }
  set searchQuery(query: string | null) {
    this._searchQuery$.next(query);
  }

  get selectedIssuesIdArr$(): Observable<string[] | null> {
    return this._selectedIssuesIdArr$.asObservable();
  }
  set selectedIssuesIdArr(idArr: string[] | null) {
    this._selectedIssuesIdArr$.next(idArr);
  }
  get selectedPeopleIdArr$(): Observable<string[] | null> {
    return this._selectedPeopleIdArr$.asObservable();
  }
  set selectedPeopleIdArr(idArr: string[] | null) {
    this._selectedPeopleIdArr$.next(idArr);
  }
  get selectedPartyTypes$(): Observable<FilterEventsByPartyTypeForm> {
    return this._selectedPartyTypes$.asObservable();
  }
  set selectedPartyTypes(selectedPartyTypes: FilterEventsByPartyTypeForm) {
    this._selectedPartyTypes$.next(selectedPartyTypes);
  }
  constructor(
    private backendApiService: BackendApiService,
  ) { }

  createEvent(
    trialCaseId: string,
    title: string,
    description: string,
    partyType: PartyTypeEnum,
    eventDate: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TimelineEvent> {
    const reqParams = {
      title,
      description,
      partyType,
      eventDate,
      trialCaseId,
      personMentions: personMentions as TimelineEventPersonMention[],
    };

    return this.backendApiService.postEntity<TimelineEvent>('timelineEvent', reqParams);
  }

  updateTimelineEvent(
    timelineEventId: string,
    title: string,
    description: string,
    partyType: PartyTypeEnum,
    eventDate: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TimelineEvent> {
    const reqParams = {
      title,
      description,
      partyType,
      eventDate,
      personMentions: personMentions as TimelineEventPersonMention[],
    };
    return this.backendApiService.updateEntity<TimelineEvent>('timelineEvent', timelineEventId, reqParams);
  }

  fetchEventData(
    timelineEventId: string,
  ): Observable<TimelineEvent | null> {
    return this.backendApiService.getEntity<TimelineEvent>('timelineEvent', timelineEventId, {
      expand: {
        timeLineEventTags: {
          expand: {
            trialCaseTag: {},
          },
        },
      },
    })
      .pipe(
        tap(timelineEvent => {
          this.selectedTimelineEvent = timelineEvent;
        }),
      );
  }

  deleteTimelineEvent(
    timelineEventId: string,
  ): Observable<TimelineEvent> {
    return this.backendApiService.deleteEntity<TimelineEvent>('timelineEvent', timelineEventId);
  }

  eraseCurrentTimelineEvent(): void {
    this.selectedTimelineEvent = null;
  }

  loadTimelineEventsByTrialCaseId(
    trialCaseId: string,
  ): Observable<TimelineEvent[]> {
    this.timelineEvents = null;

    return this.backendApiService.getEntitySet<TimelineEvent>('timelineEvent', {
      filter: {
        trialCaseId: guid(trialCaseId),
        isDeleted: false,
      },
      expand: {
        timeLineEventTags: {
          expand: {
            trialCaseTag: {},
          },
        },
        personMentions: {
          expand: {
            trialCasePerson: {},
          },
        },
      },
    })
      .pipe(
        tap(timelineEvents => this.timelineEvents = timelineEvents),
      );
  }
}
