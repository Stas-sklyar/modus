import { TrialCaseCardNote } from './trial-case-card-note';
import { Document } from './document';

export interface TrialCaseCardNoteDocument {
  id: string;
  trialCaseCardNoteId: string;
  trialCaseCardNote: TrialCaseCardNote;
  documentId: string;
  document: Document;
}
