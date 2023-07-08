import { TrialCaseTask } from './trial-case-task';
import { UserComment } from './user-comment';

export interface TrialCaseTaskUserComment {
  id: string;
  cardTaskId: string;
  applicationUserCommentId: string;
  TrialCaseTask: TrialCaseTask;
  userComment: UserComment;
}
