import { File } from './file';
import { Document } from './document';
export interface DocumentFile {
  id: string;
  documentId: string;
  document: Document;
  fileId: string;
  file: File;
}
