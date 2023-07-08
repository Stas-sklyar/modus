import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateTimelineEventFrom } from '../../../../models/interfaces/create-timeline-event-from';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map, Observable, startWith, Subscription, take } from 'rxjs';
import { TimelineEventsService } from '../../../../core/services/timeline-events/timeline-events.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { PartyTypeEnum } from '../../../../models/enums/party-type';
import { TagsService } from '../../../../core/services/tags/tags.service';
import { TrialCaseTag } from '../../../../models/interfaces/trial-case-tag';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_CHIPS_DEFAULT_OPTIONS, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'lr-create-timeline-event-modal',
  templateUrl: './create-timeline-event-modal.component.html',
  styleUrls: ['./create-timeline-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      },
    },
  ],
  encapsulation: ViewEncapsulation.None,
})

export class CreateTimelineEventModalComponent implements OnInit, OnDestroy {
  form = new FormGroup<CreateTimelineEventFrom>({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl(''),
    description: new FormControl(''),
    partyType: new FormControl(PartyTypeEnum.Defense, Validators.required),
  });
  participants$ = this.trialCasePeopleService.people$;
  private _subscription = new Subscription();

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  issues: TrialCaseTag[] = [];
  selectedIssues: any[] = [];
  // @ts-ignore
  filteredIssues: Observable<TrialCaseTag[]>;
  newIssues: string[] = [];
  selectedExistingIssues: TrialCaseTag[] = [];
  addIssuesControl = new FormControl('');
  @ViewChild('addIssueInput') addIssueInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private timelineEventsService: TimelineEventsService,
    private trialCasesService: TrialCasesService,
    private tagsService: TagsService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this.loadAllTrialCasePeople();
    this.loadAllTrialCaseTags();

    this.filteredIssues = this.addIssuesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._autocompleteFilter(value || '')),
    );
  }

  private _autocompleteFilter(value: any): TrialCaseTag[] {
    const filterValue = value?.id ? value.name.toLowerCase() : value.toLowerCase();
    return this.issues.filter(issue => issue.name.toLowerCase().includes(filterValue));
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

  loadAllTrialCasePeople(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople()
        .pipe(take(1))
        .subscribe({
          error: () => {
            this.notificationsService.notifyError('List of people not received!');
          },
        }),
    );
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createTimelineEvent(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const { title, date, time, description, partyType } = this.form.value;

    if (trialCaseId && title && date && partyType) {
      const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');
      const validDate = this.calcValidEventDate(date, time);

      this.form.disable();

      this._subscription.add(
        this.timelineEventsService.createEvent(trialCaseId, title, description || '', partyType, validDate, mentionedPeopleList)
          .subscribe({
            next: (createdTimelineEvent) => {
              this.handleIssues(createdTimelineEvent.id).subscribe({
                next: () => {
                  this.form.enable();

                  this.timelineEventsService.loadTimelineEventsByTrialCaseId(trialCaseId)
                    .subscribe({
                      error: (error) => {
                        console.error(error);
                        this.notificationsService.notifyError('An error occurred when updating the timeline events list');
                      },
                    });
                },
              });

              this.closeModal();
              this.notificationsService.notifySuccess('New timeline event successfully created');
            },
            error: () => {
              this.form.enable();
              this.notificationsService.notifyError('The timeline event is not created. Please try again later');
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
                subscriber.next();
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

                if (i === this.newIssues.length - 1) {
                  subscriber.next(createdTrialCaseIssuesIdArr);
                }
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

  addIssue(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.newIssues.push(value);
      this.selectedIssues.push({ name: value });
    }

    event.chipInput!.clear();
    this.addIssuesControl.setValue(null);
  }

  removeIssue(issue: TrialCaseTag): void {
    const indexOfNewIssue = this.newIssues.findIndex(currentIssueName => currentIssueName === issue.name);
    const indexOfSelectedIssue = this.selectedIssues.findIndex(currentIssue => currentIssue.id === issue.id);
    const indexOfSelectedExistingIssue = this.selectedExistingIssues.findIndex(currentIssue => currentIssue.id === issue.id);


    if (indexOfNewIssue !== -1) {
      this.newIssues.splice(indexOfNewIssue, 1);
    }

    if (indexOfSelectedIssue !== -1) {
      this.selectedIssues.splice(indexOfSelectedIssue, 1);
    }

    if (indexOfSelectedExistingIssue !== -1) {
      this.selectedExistingIssues.splice(indexOfSelectedExistingIssue, 1);
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
