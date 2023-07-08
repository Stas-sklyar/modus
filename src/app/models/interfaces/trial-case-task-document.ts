import { TrialCaseTask } from './trial-case-task';
import { Document } from './document';


export interface TrialCaseTaskDocument {
  id: string;
  documentId: string;
  document: Document;
  trialCaseTaskId: string;
  trialCaseTask: TrialCaseTask;
}
