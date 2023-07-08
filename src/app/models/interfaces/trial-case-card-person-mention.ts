import { TrialCaseCard } from './trial-case-card';
import { TrialCasePerson } from './trial-case-person';

export interface TrialCaseCardPersonMention {
  id: string;
  cardId: string;
  trialCasePersonId: string;
  trialCaseCard: TrialCaseCard;
  trialCasePerson: TrialCasePerson;
}
