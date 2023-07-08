import { DocumentUserComment } from './document-user-comment';
import { TrialCaseCardUserComment } from './trial-case-card-user-comment';
import { User } from './user';
import { TrialCaseNarrativeStoryUserComment } from './trial-case-narrative-story-user-comment';
import { TimelineEventUserComment } from './timeline-event-user-comment';
import { TrialCaseTaskUserComment } from './trial-case-task-user-comment';

export interface UserComment {
  id: string;
  message: string;
  modifiedDateTime: string | null;
  createdDateTime: string;
  createdByUserId: string;
  createdByUser: User;
  documentUserComments: DocumentUserComment[];
  trialCaseCardUserComments: TrialCaseCardUserComment[];
  timelineEventUserComments: TimelineEventUserComment[];
  trialCaseTaskUserComments: TrialCaseTaskUserComment[];
  trialCaseNarrativeStoryUserComments: TrialCaseNarrativeStoryUserComment[];
}
