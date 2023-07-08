import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import {
  CreateTimelineEventModalComponent,
} from '../../../modals/components/create-timeline-event-modal/create-timeline-event-modal.component';
import { Router } from '@angular/router';
import { TimelineEvent } from '../../../../models/interfaces/timeline-event';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BehaviorSubject, mergeMap, Observable, Subscription } from 'rxjs';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';
import { FilterEventsByPartyTypeForm } from '../../../../models/interfaces/filter-events-by-party-type-form';

@Component({
  selector: 'lr-case-timeline',
  templateUrl: './case-timeline.component.html',
  styleUrls: ['./case-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseTimelineComponent implements OnInit, OnDestroy {
  selectedCase$ = this.casesSrv.selectedTrialCase$;
  timelineEvents$ = this.timelineEventsService.timelineEvents$;
  private _subscription = new Subscription();

  searchQuery$ = new BehaviorSubject('');
  selectedIssuesIdArr$ = new BehaviorSubject<string[]>([]);
  selectedPeopleIdArr$ = new BehaviorSubject<string[]>([]);
  selectedPartyTypes$ = new BehaviorSubject<FilterEventsByPartyTypeForm>({
    defencePartyTypeSwitchIsActive: true,
    plaintiffPartyTypeSwitchIsActive: true,
    otherPartyTypeSwitchIsActive: true,
  });

  constructor(
    private casesSrv: TrialCasesService,
    private bsModalService: BsModalService,
    private router: Router,
    private notificationsService: NotificationsService,
    private timelineEventsService: TimelineEventsService,
  ) { }

  ngOnInit(): void {
    this.loadTimelineEvents();
    this.initSubscribers();
  }

  initSubscribers(): void {
    this._subscription.add(
      this.timelineEventsService.searchQuery$.subscribe({
        next: (query) => {
          if (query) {
            this.searchQuery$.next(query);
          }
        },
      }),
    );

    this._subscription.add(
      this.timelineEventsService.selectedIssuesIdArr$.subscribe({
        next: (selectedIssuesIdArr) => {
          if (selectedIssuesIdArr) {
            this.selectedIssuesIdArr$.next(selectedIssuesIdArr);
          }
        },
      }),
    );

    this._subscription.add(
      this.timelineEventsService.selectedPeopleIdArr$.subscribe({
        next: (selectedPeopleIdArr) => {
          if (selectedPeopleIdArr) {
            this.selectedPeopleIdArr$.next(selectedPeopleIdArr);
          }
        },
      }),
    );

    this._subscription.add(
      this.timelineEventsService.selectedPartyTypes$.subscribe({
        next: (selectedPartyTypes) => {
          if (selectedPartyTypes) {
            this.selectedPartyTypes$.next(selectedPartyTypes);
          }
        },
      }),
    );
  }

  loadTimelineEvents(): void {
    this._subscription.add(
      this.selectedCase$
        .pipe(
          mergeMap((selectedCase) => {
            if (selectedCase) {
              return this.timelineEventsService.loadTimelineEventsByTrialCaseId(selectedCase.id || '');
            } else {
              return new Observable<TimelineEvent[]>(subscriber => subscriber.next([]));
            }
          }),
        )
        .subscribe({
          error: (error) => {
            console.error(error);
            this.notificationsService.notifyError('An error occurred when getting the timeline events list');
          },
        }),
    );
  }

  backToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  expandSelectedTimelineEventCard(eventId: string): void {
    this.router.navigate([], { queryParams: {
      eventId,
    } });

  }

  openCreateTimelineEventModal(): void {
    this.bsModalService.show(CreateTimelineEventModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateTimelineEvent,
      keyboard: true,
    });
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
