import { TrialCaseCard } from './trial-case-card';
import { TrialCaseCardNotePersonMention } from './trial-case-card-note-person-mention';
import { BaseTrackEntity } from './base-track-entity';
import { TrialCaseCardNoteDocument } from './trial-case-card-note-document';

export interface TrialCaseCardNote extends BaseTrackEntity {
  id: string;
  title: string;
  description: string | null;
  order: number;
  cardId: string;
  trialCaseCard: TrialCaseCard;
  personMentions: TrialCaseCardNotePersonMention[];
  documents: TrialCaseCardNoteDocument[];
}
