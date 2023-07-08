import { Pipe, PipeTransform } from '@angular/core';
import { TimelineEvent } from '../../../models/interfaces/timeline-event';
import { FilterEventsByPartyTypeForm } from '../../../models/interfaces/filter-events-by-party-type-form';

@Pipe({
  name: 'filterEventsByPartyType',
  standalone: true,
})
export class FilterEventsByPartyTypePipe implements PipeTransform {

  transform(events: TimelineEvent[], filterEventsByPartyType: FilterEventsByPartyTypeForm): TimelineEvent[] {
    return events.filter(event => {
      if (event.partyType === 'Defense') {
        return filterEventsByPartyType.defencePartyTypeSwitchIsActive;
      }

      if (event.partyType === 'Plaintiff') {
        return filterEventsByPartyType.plaintiffPartyTypeSwitchIsActive;
      }

      if (event.partyType === 'Other') {
        return filterEventsByPartyType.otherPartyTypeSwitchIsActive;
      }

      return false;
    });
  }

}
