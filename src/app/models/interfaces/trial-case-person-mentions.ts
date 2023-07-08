import { TrialCase } from './trial-case';
import { TrialCasePerson } from './trial-case-person';

export interface TrialCasePersonMention {
  id: string;
  trialCaseId: string;
  trialCasePersonId: string;
  trialCase: TrialCase;
  trialCasePerson: TrialCasePerson;
}
