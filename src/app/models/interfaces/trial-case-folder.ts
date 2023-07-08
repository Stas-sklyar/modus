import { TrialCase } from './trial-case';
import { TrialCaseSection } from './trial-case-section';
import { BaseTrackEntity } from './base-track-entity';
export interface TrialCaseFolder extends BaseTrackEntity {
  id: string;
  name: string;
  description: string | null;
  trialCaseId: string;
  trialCase: TrialCase;
  sections: TrialCaseSection[];
}
