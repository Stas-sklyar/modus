import { TrialCaseNarrativeStoryItem } from './trial-case-narrative-story-item';
import { TrialCaseTag } from './trial-case-tag';

export interface TrialCaseNarrativeStoryItemTag {
  id: string;
  trialCaseNarrativeStoryItemId: string;
  tagId: string;
  trialCaseNarrativeStoryItem: TrialCaseNarrativeStoryItem;
  tag: TrialCaseTag;
}
