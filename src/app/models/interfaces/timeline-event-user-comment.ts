import { TimelineEvent } from './timeline-event';
import { UserComment } from './user-comment';

export interface TimelineEventUserComment {
  id: string;
  timelineEventId: string;
  userCommentId: string;
  timelineEvent: TimelineEvent;
  userComment: UserComment;
}
