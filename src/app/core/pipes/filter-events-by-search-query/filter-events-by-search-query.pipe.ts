import { Pipe, PipeTransform } from '@angular/core';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';

@Pipe({
  name: 'filterEventsBySearchQuery',
  standalone: true,
})
export class FilterEventsBySearchQueryPipe implements PipeTransform {

  transform(events: TimelineEvent[] | null, query: string = ''): TimelineEvent[] {

    if (events) {
      events = events.filter(event => {
        return event.title.toLowerCase().includes(query) || event.description?.toLowerCase().includes(query);
      });

      return events;
    }

    return [];
  }

}
