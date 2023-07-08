import { Document } from './document';
import { TimelineEventNote } from './timeline-event-note';

export interface TimelineEventNoteDocument {
  id: string;
  timelineEventNoteId: string;
  timelineEventNote: TimelineEventNote;
  documentId: string;
  document: Document;
}
