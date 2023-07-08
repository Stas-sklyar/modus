import { Pipe, PipeTransform } from '@angular/core';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';

@Pipe({
  name: 'filterEventsByIssues',
  standalone: true,
})
export class FilterEventsByIssuesPipe implements PipeTransform {

  transform(events: TimelineEvent[], issuesIdArr: string[] = []): TimelineEvent[] {
    if (issuesIdArr.length === 0) return events;

    let resultArr = [];

    for (let i = 0; i < issuesIdArr.length; i++) {

      for (let event of events) {
        let checkIsPassed = false;

        for (const issue of event.timeLineEventTags) {
          if (issue.trialCaseTagId === issuesIdArr[i]) checkIsPassed = true;
        }

        if (checkIsPassed) {
          let eventAlreadyInResultArr = resultArr.find(currentEvent => currentEvent.id === event.id);
          if (!eventAlreadyInResultArr) resultArr.push(event);
        }
      }
    }

    return resultArr;
  }

}
