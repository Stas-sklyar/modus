import { Document } from './document';
import { TrialCaseTag } from './trial-case-tag';

export interface DocumentTag {
  id: string;
  documentId: string;
  document: Document;
  trialCaseTagId: string;
  trialCaseTag: TrialCaseTag;
}
