import { TrialCasePerson } from './trial-case-person';
import { TrialCaseNarrativeStory } from './trial-case-narrative-story';


export interface TrialCaseNarrativeStoryPersonMention {
  id: string;
  trialCaseNarrativeStoryId: string;
  trialCasePersonId: string;
  trialCaseNarrativeStory: TrialCaseNarrativeStory;
  trialCasePerson: TrialCasePerson;
}
