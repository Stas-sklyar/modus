import { TrialCaseNarrativeStoryItem } from './trial-case-narrative-story-item';
import { TrialCasePerson } from './trial-case-person';


export interface TrialCaseNarrativeStoryItemPersonMention {
  id: string;
  trialCaseNarrativeStoryItemId: string;
  trialCasePersonId: string;
  trialCaseNarrativeStoryItem: TrialCaseNarrativeStoryItem;
  trialCasePerson: TrialCasePerson;
}
