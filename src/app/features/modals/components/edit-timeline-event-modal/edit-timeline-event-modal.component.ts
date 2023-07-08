import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { EditTimelineEventFrom } from '../../../../models/interfaces/edit-timeline-event-form';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, map, Observable, startWith, Subscription, switchMap, take, tap } from 'rxjs';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import {
  TimelineEventEntitiesService,
} from '../../../../core/services/timeline-event-entities/timeline-event-entities.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { TimelineEvent } from '../../../../models/interfaces/timeline-event';
import { PartyTypeEnum } from '../../../../models/enums/party-type';
import { MAT_CHIPS_DEFAULT_OPTIONS, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TrialCaseTag } from '../../../../models/interfaces/trial-case-tag';
import { TagsService } from '../../../../core/services/tags/tags.service';

@Component({
  selector: 'lr-edit-timeline-event-modal',
  templateUrl: './edit-timeline-event-modal.component.html',
  styleUrls: ['./edit-timeline-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      },
    },
  ],
})

export class EditTimelineEventModalComponent implements OnDestroy, OnInit {
  // TODO: eventId always === null
  @Input() eventId!: string;

  trialCaseId = this.trialCasesService.selectedTrialCase?.id;
  timelineEventId = this.route.snapshot.queryParamMap.get('eventId');

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  issues: TrialCaseTag[] = [];
  selectedIssues: any[] = [];
  // @ts-ignore
  filteredIssues: Observable<TrialCaseTag[]>;
  newIssues: string[] = [];
  selectedExistingIssues: TrialCaseTag[] = [];
  simplifiedSourceTimelineEventIssues: { id: string, name: string }[] = [];
  issuesForDetachmentFromTimelineEvent: { id: string, name: string }[] = [];
  addIssuesControl = new FormControl('');
  @ViewChild('addIssueInput') addIssueInput: ElementRef<HTMLInputElement> | undefined;

  form = new FormGroup<EditTimelineEventFrom>({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl(''),
    description: new FormControl(''),
    partyType: new FormControl(PartyTypeEnum.Defense, Validators.required),
  });
  timelineEvent$!: Observable<TimelineEvent | null>;
  participants$ = this.trialCasePeopleService.people$;
  timelineEventTags$ = this.timelineEventEntitiesService.timelineEventTags$;

  private _subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private timelineEventsService: TimelineEventsService,
    private trialCasesService: TrialCasesService,
    private timelineEventEntitiesService: TimelineEventEntitiesService,
    private route: ActivatedRoute,
    private bsModalRef: BsModalRef,
    private trialCasePeopleService: TrialCasePeopleService,
    private tagsService: TagsService,
  ) {}

  ngOnInit(): void {
    this.loadAllTrialCaseTags();
    this.fetchTimelineEventData();
    this.loadParticipants();

    this.filteredIssues = this.addIssuesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._autocompleteFilter(value || '')),
    );
  }

  loadAllTrialCaseTags(): void {
    this._subscription.add(
      this.tagsService.getTagsByTrialCaseId()
        .pipe(take(1))
        .subscribe({
          next: (issues: TrialCaseTag[] | null) => {
            if (issues) {
              this.issues = issues;
            }
          },
          error: () => {
            this.notificationsService.notifyError('List of issues not received!');
          },
        }),
    );
  }
  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  fetchTimelineEventData(): void {
    this.timelineEvent$ = this.timelineEventsService.fetchEventData(this.timelineEventId || '')
      .pipe(
        tap((timelineEvent) => {
          if (timelineEvent) {
            this.fillFormData(timelineEvent);
            this.simplifiedSourceTimelineEventIssues = timelineEvent.timeLineEventTags.map(issue => { return { id: issue.id, name: issue.trialCaseTag.name }; });
            this.selectedIssues = this.simplifiedSourceTimelineEventIssues;
          }
        }),
      );
  }

  fillFormData(timelineEvent: TimelineEvent): void {
    this.form.get('title')?.setValue(timelineEvent.title);
    this.form.get('date')?.setValue(timelineEvent.eventDate.substring(0, 10));
    this.form.get('time')?.setValue(new Date(timelineEvent.eventDate).getHours() + ':' + new Date(timelineEvent.eventDate).getMinutes());
    this.form.get('description')?.setValue(timelineEvent.description);
    this.form.get('partyType')?.setValue(timelineEvent.partyType);
  }

  private _autocompleteFilter(value: any): TrialCaseTag[] {
    const filterValue = value?.id ? value.name.toLowerCase() : value.toLowerCase();
    return this.issues.filter(issue => issue.name.toLowerCase().includes(filterValue));
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  editTimelineEvent(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const { title, date, time, description, partyType } = this.form.value;

    if (trialCaseId && title && date && partyType) {
      const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');
      const validDate = this.calcValidEventDate(date, time);

      this.form.disable();

      this._subscription.add(
        this.timelineEventsService.updateTimelineEvent(this.timelineEventId || '', title, description || '', partyType, validDate, mentionedPeopleList)
          .subscribe({
            next: () => {
              this.handleIssues(this.timelineEventId || '')
                .pipe(
                  switchMap(() => this.timelineEventsService.loadTimelineEventsByTrialCaseId(trialCaseId || '')),
                  switchMap(() => this.timelineEventsService.fetchEventData(this.timelineEventId || '')),
                  take(1),
                  finalize(() => this.form.enable()),
                )
                .subscribe();

              this.closeModal();
              this.notificationsService.notifySuccess('Timeline Event successfully edited');
            },
          })
        ,
      );
    } else {
      this.notificationsService.notifyError('Enter required fields');
    }
  }

  calcValidEventDate(date: string, time: string | null | undefined): string {
    let validDate: Date | string = new Date(date);

    if (!time) {
      return validDate.toISOString();
    } else {
      const hours: number = parseInt(time.split(':')[0]);
      const minutes: number = parseInt(time.split(':')[1]);

      validDate.setHours(hours);
      validDate.setMinutes(minutes);
      return validDate.toISOString();
    }
  }

  handleIssues(timelineEventId: string): Observable<void> {
    const userStartedToInputNewIssueName = this.addIssueInput?.nativeElement.value;
    if (userStartedToInputNewIssueName) this.newIssues.push(this.addIssueInput?.nativeElement.value || '');

    return new Observable<void>((subscriber) => {
      this.createNewTrialCaseIssues()
        .subscribe({
          next: (createdTrialCaseIssuesIdArr: string[]) => {
            this.createTimelineEventIssues(createdTrialCaseIssuesIdArr, timelineEventId).subscribe({
              next: () => {
                this.detachIssuesFromTimelineEvent()
                  .subscribe({
                    next: () => {
                      subscriber.next();
                    },
                  });
              },
            });
          },
        });
    });
  }

  createNewTrialCaseIssues(): Observable<string[]> {
    return new Observable<string[]>((subscriber) => {
      let createdTrialCaseIssuesIdArr: string[] = [];

      if (this.newIssues.length === 0) {
        subscriber.next(createdTrialCaseIssuesIdArr);
      } else {
        for (let i = 0; i < this.newIssues.length; i++) {
          this.tagsService.createTag(this.newIssues[i])
            .subscribe({
              next: (createdTrialCaseTag) => {
                createdTrialCaseIssuesIdArr.push(createdTrialCaseTag.id);

                if (i === this.newIssues.length - 1) { subscriber.next(createdTrialCaseIssuesIdArr); }
              },
            });
        }
      }
    });
  }

  createTimelineEventIssues(createdTrialCaseIssuesIdArr: string[], timelineEventId: string): Observable<void> {
    const idsOfSelectedExistingIssues = this.selectedExistingIssues.map(issue => issue.id);
    const fullTrialCaseIssuesArr = idsOfSelectedExistingIssues.concat([...createdTrialCaseIssuesIdArr]);

    return new Observable<void>((subscriber) => {
      if (fullTrialCaseIssuesArr.length === 0) {
        subscriber.next();
      } else {
        for (let i = 0; i < fullTrialCaseIssuesArr.length; i++) {
          this.tagsService.createTimelineEventTag(timelineEventId, fullTrialCaseIssuesArr[i])
            .subscribe({
              next: () => {
                if (i === fullTrialCaseIssuesArr.length - 1) {
                  subscriber.next();
                }
              },
            });
        }
      }
    });
  }

  detachIssuesFromTimelineEvent(): Observable<void> {
    return new Observable((subscriber) => {
      if (this.issuesForDetachmentFromTimelineEvent.length === 0) {
        subscriber.next();
      } else {
        for (let i = 0; i < this.issuesForDetachmentFromTimelineEvent.length; i++) {
          this.tagsService.deleteTimelineEventTag(this.issuesForDetachmentFromTimelineEvent[i].id)
            .subscribe({
              next: () => {
                if (i === this.issuesForDetachmentFromTimelineEvent.length - 1) {
                  subscriber.next();
                }
              },
            });
        }
      }
    });
  }

  addIssue(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.newIssues.push(value);
      this.selectedIssues.push({ name: value });
    }

    event.chipInput!.clear();
  }

  removeIssue(issue: TrialCaseTag): void {
    const indexOfNewIssue = this.newIssues.findIndex(currentIssueName => currentIssueName === issue.name);
    const indexOfSelectedIssue = this.selectedIssues.findIndex(currentIssue => currentIssue.id === issue.id);
    const indexOfSelectedExistingIssue = this.selectedExistingIssues.findIndex(currentIssue => currentIssue.id === issue.id);
    const indexOfSimplifiedSourceTimelineEventIssue = this.simplifiedSourceTimelineEventIssues.findIndex(currentIssue => currentIssue.id === issue.id);

    if (indexOfNewIssue !== -1) {
      this.newIssues.splice(indexOfNewIssue, 1);
    }

    if (indexOfSelectedIssue !== -1) {
      this.selectedIssues.splice(indexOfSelectedIssue, 1);
    }

    if (indexOfSelectedExistingIssue !== -1) {
      this.selectedExistingIssues.splice(indexOfSelectedExistingIssue, 1);
    }

    if (indexOfSimplifiedSourceTimelineEventIssue !== -1) {
      this.issuesForDetachmentFromTimelineEvent.push(issue);
    }
  }

  onSelectIssue(selectedIssue: TrialCaseTag): void {
    this.selectedExistingIssues.push(selectedIssue);
    this.selectedIssues.push(selectedIssue);
    this.addIssuesControl.setValue(null);
    if (this.addIssueInput) { this.addIssueInput.nativeElement.value = ''; }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
