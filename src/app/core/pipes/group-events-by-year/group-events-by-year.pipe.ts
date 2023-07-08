import { Pipe, PipeTransform } from '@angular/core';
import { SetOfEvents } from '../../../models/interfaces/set-of-events';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';

@Pipe({
  name: 'groupEventsByYear',
  standalone: true,
})
export class GroupEventsByYearPipe implements PipeTransform {

  transform(events: TimelineEvent[] | null): SetOfEvents[] {
    if (!events || events.length === 0) return [];

    let setOfEvents: SetOfEvents[] = [];
    let years: number[] = [];

    events.sort((event1, event2) => {
      // @ts-ignore
      return new Date(event2.eventDate) - new Date(event1.eventDate);
    });

    // Calc years array
    for (let i = 0; i < events.length; i++) {
      let yearAlreadyInArr = years.find(year => year === new Date(events[i].eventDate).getFullYear());

      if (!yearAlreadyInArr) {
        let year = new Date(events[i].eventDate).getFullYear();
        years.push(year);
      }
    }

    // Calc tempSetOfEvents
    for (let i = 0; i < years.length; i++) {
      let currentYear = years[i];
      let eventsByCurrentYear: TimelineEvent[] = [];

      for (let j = 0; j < events.length; j++) {
        let currentEventYear = new Date(events[j].eventDate).getFullYear();

        if (currentEventYear === currentYear) {
          eventsByCurrentYear.push(events[j]);
        }
      }

      setOfEvents.push({
        events: [...eventsByCurrentYear],
        year: currentYear,
      });
    }

    return setOfEvents;
  }

}
