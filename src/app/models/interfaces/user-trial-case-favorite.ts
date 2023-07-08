import { TrialCase } from './trial-case';
import { User } from './user';

export interface UserTrialCaseFavorite {
  id: string;
  createdDateTime: string;
  trialCaseId: string;
  userId: string;
  trialCase: TrialCase;
  user: User;
}
