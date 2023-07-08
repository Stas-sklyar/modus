import { Pipe, PipeTransform } from '@angular/core';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';

@Pipe({
  name: 'filterEventsByPeople',
  standalone: true,
})
export class FilterEventsByPeoplePipe implements PipeTransform {

  transform(events: TimelineEvent[], peopleIdArr: string[] = []): TimelineEvent[] {
    if (peopleIdArr.length === 0) return events;

    let resultArr = [];

    for (let i = 0; i < peopleIdArr.length; i++) {

      for (let event of events) {
        let checkIsPassed = false;

        for (const person of event.personMentions) {
          if (person.trialCasePersonId === peopleIdArr[i]) checkIsPassed = true;
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
