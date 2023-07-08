import { TimelineEventPersonMention } from './timeline-event-person-mention';
import { TimelineEventNote } from './timeline-event-note';
import { BaseTrackEntity } from './base-track-entity';
import { TrialCase } from './trial-case';
import { TimelineEventTag } from './timeline-event-tag';
import { TimelineEventUserComment } from './timeline-event-user-comment';
import { PartyTypeEnum } from '../enums/party-type';

export interface TimelineEvent extends BaseTrackEntity {
  id: string;
  title: string;
  description: string | null;
  partyType: PartyTypeEnum;
  eventDate: string;
  trialCaseId: string;
  trialCase: TrialCase;
  notes: TimelineEventNote[];
  timeLineEventApplicationUserComments: TimelineEventUserComment[];
  timeLineEventTags: TimelineEventTag[];
  personMentions: TimelineEventPersonMention[];
}
