import { Document } from './document';
import { TrialCaseNarrativeStory } from './trial-case-narrative-story';

export interface TrialCaseNarrativeStoryDocument {
  id: string;
  documentId: string;
  trialCaseNarrativeStoryId: string;
  document: Document;
  trialCaseNarrativeStory: TrialCaseNarrativeStory;
}
