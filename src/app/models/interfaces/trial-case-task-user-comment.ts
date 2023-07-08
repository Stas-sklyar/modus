import { TrialCaseTask } from './trial-case-task';
import { UserComment } from './user-comment';


export interface TrialCaseTaskUserComment {
  id: string;
  trialCaseTaskId: string;
  applicationUserCommentId: string;
  trialCaseTask: TrialCaseTask;
  userComment: UserComment;
}
