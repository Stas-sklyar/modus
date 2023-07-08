import { TimelineEventNote } from './timeline-event-note';
import { TrialCasePerson } from './trial-case-person';

export interface TimelineEventNotePersonMention {
  id: string;
  timelineEventNoteId: string;
  trialCasePersonId: string;
  timelineEventNote: TimelineEventNote;
  trialCasePerson: TrialCasePerson;
}
