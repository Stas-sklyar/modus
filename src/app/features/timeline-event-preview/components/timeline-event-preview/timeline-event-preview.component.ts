import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import { Modal } from '../../../../models/enums/modal';
import {
  EditTimelineEventModalComponent,
} from '../../../modals/components/edit-timeline-event-modal/edit-timeline-event-modal.component';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';
import { TimelineEvent } from '../../../../models/interfaces/timeline-event';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import {
  TimelineEventEntitiesService,
} from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';

@Component({
  selector: 'lr-timeline-event-preview',
  templateUrl: './timeline-event-preview.component.html',
  styleUrls: ['./timeline-event-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineEventPreviewComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('headerContainer') headerContainer: ElementRef | null = null;
  @ViewChild('timelineEventPreview') timelineEventPreview: ElementRef | null = null;
  eventId = this.route.snapshot.queryParamMap.get('eventId');

  categoryList: string[] = ['general', 'comments', 'documents'];
  selectedCategory: string = 'general';
  selectedTimelineEvent$ = this.timelineEventsService.selectedTimelineEvent$;
  private _subscription = new Subscription();
  selectedAddContentMenuItemType: string | null = null;
  hideHeaderMenuToggle = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService,
    private _renderer: Renderer2,
    private trialCasesService: TrialCasesService,
    private timelineEventsService: TimelineEventsService,
    private notificationsSrv: NotificationsService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
  ) { }

  ngOnInit(): void {
    this.getTimelineEventContent(this.eventId || '').subscribe();
  }

  ngAfterContentChecked(): void {
    this.calcHeaderContainerHeight();
  }

  calcHeaderContainerHeight(): void {
    if (this.headerContainer?.nativeElement.offsetHeight) {
      const unnecessaryPadding = 20;
      const headerContainerHeight = this.headerContainer?.nativeElement.offsetHeight - unnecessaryPadding;

      this._renderer.setStyle(this.timelineEventPreview?.nativeElement, 'paddingTop', headerContainerHeight + 'px');
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.timelineEventsService.eraseCurrentTimelineEvent();
  }

  openEditEntityModal(): void {
    this.bsModalService.show(EditTimelineEventModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditTimelineEvent,
      initialState: {
        eventId: this.eventId || undefined,
      },
      keyboard: true,
    });
  }

  onCreateContent(menuItemType: string): void {
    this.selectedCategory = menuItemType;
    this.selectedAddContentMenuItemType = menuItemType;
  }

  private getTimelineEventContent(
    eventId: string,
  ): Observable<TimelineEvent | null> {
    return this.timelineEventsService.fetchEventData(eventId)
      .pipe(
        take(1),
      );
  }

  openSortNotesModal(): void {
    const notes = this.timelineEventEntitiesService.notes || [];

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: notes,
        timelineEventId: this.eventId || '',
        title: 'Sort timeline event notes',
        fieldName: 'title',
        sortType: SortTypeEnum.SORT_TIMELINE_EVENT_NOTES,
      },
      keyboard: true,
    });
  }

  deleteTimelineEvent(): void {
    const caseId = this.trialCasesService.selectedTrialCase?.id;

    this._subscription.add(
      this.timelineEventsService.deleteTimelineEvent(this.eventId || '')
        .pipe(
          switchMap(() => this.timelineEventsService.loadTimelineEventsByTrialCaseId(caseId || '')),
          take(1),
        )
        .subscribe({
          next: () => {
            this.cleanUrlParams();
            this.notificationsSrv.notifySuccess('Timeline event removed successfully');
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        }),
    );
  }

  private cleanUrlParams(): void {
    this.router.navigate([], {
      queryParams: null,
    });
  }
}
