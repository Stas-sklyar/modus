import { TrialCaseNarrativeStory } from './trial-case-narrative-story';
import { TrialCaseTag } from './trial-case-tag';

export interface TrialCaseNarrativeStoryTag {
  id: string;
  trialCaseNarrativeStoryId: string;
  trialCaseTagId: string;
  trialCaseNarrativeStory: TrialCaseNarrativeStory;
  tag: TrialCaseTag;
}
