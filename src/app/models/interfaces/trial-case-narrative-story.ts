import { BaseTrackEntity } from './base-track-entity';
import { TrialCase } from './trial-case';
import { TrialCaseNarrativeStoryUserComment } from './trial-case-narrative-story-user-comment';
import { TrialCaseNarrativeStoryItem } from './trial-case-narrative-story-item';
import { TrialCaseNarrativeStoryPersonMention } from './trial-case-narrative-story-person-mention';

export interface TrialCaseNarrativeStory extends BaseTrackEntity {
  id: string;
  title: string;
  description: string | null;
  order: number;
  trialCaseId: string;
  trialCase: TrialCase;
  comments: TrialCaseNarrativeStoryUserComment[];
  trialCaseNarrativeStoryItems: TrialCaseNarrativeStoryItem[];
  personMentions: TrialCaseNarrativeStoryPersonMention[];
}
