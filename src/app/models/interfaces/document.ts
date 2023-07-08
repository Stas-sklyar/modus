import { BaseTrackEntity } from './base-track-entity';
import { DocumentFolder } from './document-folder';
import { DocumentFile } from './document-file';
import { DocumentUserComment } from './document-user-comment';
import { TimelineEventNoteDocument } from './timeline-event-note-document';
import { TrialCaseCardNoteDocument } from './trial-case-card-note-document';
import { TrialCaseNarrativeStoryDocument } from './trial-case-narrative-story-document';
import { DocumentTag } from './document-tag';

export interface Document extends BaseTrackEntity {
  id: string;
  title: string;
  stamp: string | null;
  batesNumber: string | null;
  description: string | null;
  documentParentId: string | null;
  documentFolderId: string;
  parent: Document | null;
  documentFolder: DocumentFolder;
  documents: Document[];
  files: DocumentFile[];
  tags: DocumentTag[];
  comments: DocumentUserComment[];
  timelineEventNoteDocuments: TimelineEventNoteDocument[];
  trialCaseCardNoteDocuments: TrialCaseCardNoteDocument[];
  trialCaseNarrativeStoryDocuments: TrialCaseNarrativeStoryDocument[];
}

export interface WithDividedStamps {
  batesStamp: string | null;
  exhibitStamp: string | null;
}
