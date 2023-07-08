import { User } from './user';

export interface UserActivity {
  id: string;
  message: string;
  createdDateTime: string;
  createdByUserId: string;
  createdByUser: User;
}
