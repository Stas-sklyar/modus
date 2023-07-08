import { User } from './user';

export interface BaseTrackEntity {
  isDeleted: boolean;
  createdDateTime: string;
  modifiedDateTime: string | null;
  deletedDateTime: string | null;
  createdByUserId: string;
  modifiedByUserId: string | null;
  deletedByUserId: string | null;
  createdByUser: User;
  modifiedByUser: User | null;
  deletedByUser: User | null;
}
