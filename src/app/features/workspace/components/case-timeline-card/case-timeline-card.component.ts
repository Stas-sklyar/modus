import { Component, Input } from '@angular/core';
import { TimelineEvent } from '../../../../models/interfaces/timeline-event';

@Component({
  selector: 'lr-case-timeline-card',
  templateUrl: './case-timeline-card.component.html',
  styleUrls: ['./case-timeline-card.component.scss'],
})
export class CaseTimelineCardComponent {
  @Input() timelineEventCard: TimelineEvent | null = null;
}
