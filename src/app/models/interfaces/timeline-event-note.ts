import { TimelineEvent } from './timeline-event';
import { TimelineEventNotePersonMention } from './timeline-event-note-person-mention';
import { BaseTrackEntity } from './base-track-entity';
import { TimelineEventNoteDocument } from './timeline-event-note-document';

export interface TimelineEventNote extends BaseTrackEntity {
  id: string;
  title: string;
  description: string | null;
  order: number;
  timeLineEventId: string;
  timelineEvent: TimelineEvent;
  personMentions: TimelineEventNotePersonMention[];
  documents: TimelineEventNoteDocument[]
}
