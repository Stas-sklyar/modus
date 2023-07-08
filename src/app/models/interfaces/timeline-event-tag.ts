import { TimelineEvent } from './timeline-event';
import { TrialCaseTag } from './trial-case-tag';


export interface TimelineEventTag {
  id: string;
  timelineEventId: string;
  trialCaseTagId: string;
  timelineEvent: TimelineEvent;
  trialCaseTag: TrialCaseTag;
}
