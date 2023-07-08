import { TrialCaseCard } from './trial-case-card';
import { UserComment } from './user-comment';

export interface TrialCaseCardUserComment {
  id: string;
  trialCaseCardId: string;
  applicationUserCommentId: string;
  trialCaseCard: TrialCaseCard;
  userComment: UserComment;
}
