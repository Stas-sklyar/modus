import { TrialCaseCardNote } from './trial-case-card-note';
import { TrialCasePerson } from './trial-case-person';

export interface TrialCaseCardNotePersonMention {
  id: string;
  trialCaseCardNoteId: string;
  trialCasePersonId: string;
  trialCaseCardNote: TrialCaseCardNote;
  trialCasePerson: TrialCasePerson;
}
