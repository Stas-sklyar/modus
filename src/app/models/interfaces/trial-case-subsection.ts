import { TrialCaseSection } from './trial-case-section';
import { TrialCaseCard } from './trial-case-card';
import { BaseTrackEntity } from './base-track-entity';

export interface TrialCaseSubsection extends BaseTrackEntity {
  id: string;
  name: string;
  trialCaseSectionId: string;
  trialCaseSection: TrialCaseSection;
  cards: TrialCaseCard[];
}
