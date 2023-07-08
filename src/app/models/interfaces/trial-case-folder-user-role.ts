import { User } from './user';
import { TrialCaseFolder } from './trial-case-folder';

export interface TrialCaseFolderUserRole {
  id: string;
  trialCaseFolderId: string;
  userId: string;
  trialCaseFolder: TrialCaseFolder | null;
  user: User | null;
  roles: string | null;
}
