import { TrialCaseCardUserComment } from './trial-case-card-user-comment';
import { TrialCaseCardNote } from './trial-case-card-note';
import { BaseTrackEntity } from './base-track-entity';
import { TrialCaseCardPersonMention } from './trial-case-card-person-mention';
import { TrialCaseSubsection } from './trial-case-subsection';
import { TrialCaseTask } from './trial-case-task';
import { TrialCaseNotebookSection } from './trial-case-notebook-section';

export interface TrialCaseCard extends BaseTrackEntity {
  id: string;
  name: string;
  description: string | null;
  trialCaseSubsectionId: string | null;
  trialNotebookSectionId: string | null;
  order: number;
  trialCaseNotebookSection: TrialCaseNotebookSection | null;
  trialCaseSubsection: TrialCaseSubsection | null;
  cardNotes: TrialCaseCardNote[];
  tasks: TrialCaseTask[];
  comments: TrialCaseCardUserComment[];
  personMentions: TrialCaseCardPersonMention[];
}
