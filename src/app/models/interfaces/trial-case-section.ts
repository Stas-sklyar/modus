import { TrialCaseFolder } from './trial-case-folder';
import { TrialCaseSubsection } from './trial-case-subsection';
import { BaseTrackEntity } from './base-track-entity';

export interface TrialCaseSection extends BaseTrackEntity {
  id: string;
  name: string;
  description: string | null;
  trialCaseFolderId: string | null;
  folder: TrialCaseFolder;
  subsections: TrialCaseSubsection[];
}
