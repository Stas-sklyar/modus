import { TrialCase } from './trial-case';
import { TimelineEventTag } from './timeline-event-tag';
import { TrialCaseNarrativeStoryTag } from './trial-case-narrative-story-tag';

export interface TrialCaseTag {
  id: string;
  name: string;
  trialCaseId: string;
  trialCase: TrialCase;
  timeLineEventTags: TimelineEventTag[];
  trialCaseNarrativeStoryTags: TrialCaseNarrativeStoryTag[];
}
