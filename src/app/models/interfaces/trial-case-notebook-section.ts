import { BaseTrackEntity } from './base-track-entity';
import { TrialCaseCard } from './trial-case-card';

export interface TrialCaseNotebookSection extends BaseTrackEntity {
  id: string;
  title: string;
  trialCaseId: string;
  cards: TrialCaseCard[];
}
