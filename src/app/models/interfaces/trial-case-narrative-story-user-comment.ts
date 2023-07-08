import { TrialCaseNarrativeStory } from './trial-case-narrative-story';
import { UserComment } from './user-comment';

export interface TrialCaseNarrativeStoryUserComment {
  id: string;
  trialCaseNarrativeStoryId: string;
  applicationUserCommentId: string;
  trialCaseNarrativeStory: TrialCaseNarrativeStory;
  userComment: UserComment;
}
