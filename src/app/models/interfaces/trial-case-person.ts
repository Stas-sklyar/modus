import { TrialCase } from './trial-case';
import { TrialCaseCardNotePersonMention } from './trial-case-card-note-person-mention';
import { TimelineEventNotePersonMention } from './timeline-event-note-person-mention';
import { TrialCaseCardPersonMention } from './trial-case-card-person-mention';
import { BaseTrackEntity } from './base-track-entity';

export interface TrialCasePerson extends BaseTrackEntity {
  id: string;
  name: string;
  userType: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  description: string | null;
  trialCaseId: string;
  trialCase: TrialCase;
  cardNoteMentions: TrialCaseCardNotePersonMention[];
  timelineEventNotePersonMentions: TimelineEventNotePersonMention[];
  assignedTrialCaseCards: TrialCaseCardPersonMention[];
}
