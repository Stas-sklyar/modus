import { BaseTrackEntity } from './base-track-entity';
import { User } from './user';
import { TrialCase } from './trial-case';
import { TrialCaseCard } from './trial-case-card';
import { TrialCaseTaskUserComment } from './trial-case-task-user-comment';
import { TrialCaseTaskDocument } from './trial-case-task-document';

export interface TrialCaseTask extends BaseTrackEntity {
  id: string;
  status: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completedDate: string | null;
  order: number;
  assignedToUserId: string;
  trialCaseId: string;
  trialCaseCardId: string | null;
  trialCase: TrialCase;
  assignedToUser: User;
  trialCaseCard: TrialCaseCard | null;
  comments: TrialCaseTaskUserComment[];
  documents: TrialCaseTaskDocument[];
}
