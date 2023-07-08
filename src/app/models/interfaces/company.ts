import { User } from './user';
import { TrialCase } from './trial-case';
import { BaseTrackEntity } from './base-track-entity';

export interface Company extends BaseTrackEntity {
  id: string;
  name: string;
  description: string | null;
  applicationUsers: User[];
  trialCases: TrialCase[];
}
