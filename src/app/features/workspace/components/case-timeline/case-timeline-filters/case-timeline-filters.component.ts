import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TimelineEventSwitchesForm } from '../../../../../models/interfaces/timeline-event-switches-form';
import { Subscription } from 'rxjs';
import { TimelineEvent } from '../../../../../models/interfaces/timeline-event';
import { TrialCasePerson } from '../../../../../models/interfaces/trial-case-person';
import { TimelineEventTag } from '../../../../../models/interfaces/timeline-event-tag';
import { TrialCaseTag } from '../../../../../models/interfaces/trial-case-tag';
import { TimelineEventsService } from '../../../../../core/services/timeline-events/timeline-events.service';

@Component({
  selector: 'lr-case-timeline-filters',
  templateUrl: './case-timeline-filters.component.html',
  styleUrls: ['./case-timeline-filters.component.scss'],
})
export class CaseTimelineFiltersComponent implements OnInit, OnChanges, OnDestroy {

  @Input() timelineEvents: TimelineEvent[] = [];
  switchForm = new FormGroup<TimelineEventSwitchesForm>({
    defenceSwitch: new FormControl(true),
    plaintiffSwitch: new FormControl(true),
    otherSwitch: new FormControl(true),
  });
  private _subscription = new Subscription();
  people: TrialCasePerson[] = [];
  tags: TrialCaseTag[] = [];

  constructor(
    private timelineEventsService: TimelineEventsService,
  ) {
  }

  ngOnInit(): void {
    this.switchForm.valueChanges.subscribe(switchForm  => {

      this.timelineEventsService.selectedPartyTypes = {
        defencePartyTypeSwitchIsActive: switchForm.defenceSwitch || false,
        plaintiffPartyTypeSwitchIsActive: switchForm.plaintiffSwitch || false,
        otherPartyTypeSwitchIsActive: switchForm.otherSwitch || false,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calcPeople(changes['timelineEvents']?.currentValue);
    this.calcTags(changes['timelineEvents']?.currentValue);
  }

  calcPeople(timelineEvents: TimelineEvent[]): void {
    let tempPeopleArr: TrialCasePerson[] = [];

    for (let i = 0; i < timelineEvents.length; i++) {
      for (let j = 0; j < timelineEvents[i].personMentions.length; j++) {
        tempPeopleArr.push(timelineEvents[i].personMentions[j].trialCasePerson);
      }
    }

    tempPeopleArr = [...new Map(tempPeopleArr.map(item => [item.id, item])).values()];

    this.people = tempPeopleArr;
  }

  calcTags(timelineEvents: TimelineEvent[]): void {
    let tempTagsArr: TrialCaseTag[] = [];

    for (let i = 0; i < timelineEvents.length; i++) {
      for (let j = 0; j < timelineEvents[i].timeLineEventTags.length; j++) {
        tempTagsArr.push(timelineEvents[i].timeLineEventTags[j].trialCaseTag);
      }
    }

    tempTagsArr = [...new Map(tempTagsArr.map(item => [item.id, item])).values()];

    this.tags = tempTagsArr;
  }

  filterTimelineEventsBySearchQuery(searchQuery: string): void {
    this.timelineEventsService.searchQuery = searchQuery;
  }
  filterTimelineEventsByPeople(people: TrialCasePerson[]): void {
    const arrayOfPeopleId = people.map(person => person.id );
    this.timelineEventsService.selectedPeopleIdArr = arrayOfPeopleId;
  }

  filterTimelineEventsByIssues(issues: TimelineEventTag[]): void {
    const arrayOfIssuesId = issues.map(issue => issue.id);
    this.timelineEventsService.selectedIssuesIdArr = arrayOfIssuesId;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
