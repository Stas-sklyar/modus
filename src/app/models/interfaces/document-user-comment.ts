import { Document } from './document';
import { UserComment } from './user-comment';

export interface DocumentUserComment {
  id: string;
  documentId: string;
  document: Document;
  applicationUserCommentId: string;
  userComment: UserComment;
}
