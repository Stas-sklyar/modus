import { TrialCaseNarrativeStoryItem } from './trial-case-narrative-story-item';
import { Document } from './document';

export interface TrialCaseNarrativeStoryItemDocument {
  id: string;
  trialCaseNarrativeStoryItemId: string;
  trialCaseNarrativeStoryItem: TrialCaseNarrativeStoryItem;
  documentId: string;
  document: Document;
}
