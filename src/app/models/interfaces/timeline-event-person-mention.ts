import { TrialCasePerson } from './trial-case-person';
import { TimelineEvent } from './timeline-event';

export interface TimelineEventPersonMention {
  id: string;
  timelineEventId: string;
  trialCasePersonId: string;
  timelineEvent: TimelineEvent;
  trialCasePerson: TrialCasePerson;
}
