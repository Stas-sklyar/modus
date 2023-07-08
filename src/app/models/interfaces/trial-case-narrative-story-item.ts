import { BaseTrackEntity } from './base-track-entity';
import { TrialCaseNarrativeStory } from './trial-case-narrative-story';
import { TrialCaseNarrativeStoryItemDocument } from './trial-case-narrative-story-item-document';
import { TrialCaseNarrativeStoryItemTag } from './trial-case-narrative-story-item-tag';
import { TrialCaseNarrativeStoryItemPersonMention } from './trial-case-narrative-story-item-person-mention';

export interface TrialCaseNarrativeStoryItem extends BaseTrackEntity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  order: number;
  trialCaseNarrativeStoryId: string;
  trialCaseNarrativeStoryItemId: string | null;
  story: TrialCaseNarrativeStory;
  parentStoryItem: TrialCaseNarrativeStoryItem;
  items: TrialCaseNarrativeStoryItem[];
  documents: TrialCaseNarrativeStoryItemDocument[];
  tags: TrialCaseNarrativeStoryItemTag[];
  personMentions: TrialCaseNarrativeStoryItemPersonMention[];
}
