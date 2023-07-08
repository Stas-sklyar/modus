import { Document } from './document';
import { BaseTrackEntity } from './base-track-entity';
import { TrialCase } from './trial-case';

export interface DocumentFolder extends BaseTrackEntity {
  id: string;
  name: string;
  trialCaseId: string;
  parentDocumentFolderId: string | null;
  trialCase: TrialCase;
  parent: DocumentFolder | null;
  documents: Document[];
  subFolders: DocumentFolder[];
}
