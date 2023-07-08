import { TrialCase } from './trial-case';
import { User } from './user';

export interface TrialCaseUserRole {
  id: string;
  trialCaseId: string;
  userId: string;
  trialCase: TrialCase | null;
  user: User | null;
  roles: string | null;
}
