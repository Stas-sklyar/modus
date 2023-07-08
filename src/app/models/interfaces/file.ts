import { BaseTrackEntity } from './base-track-entity';
import { DocumentFile } from './document-file';


export interface File extends BaseTrackEntity {
  id: string;
  fileName: string;
  fileExtension: string;
  fileUrl: string | null;
  fileContentType: string | null;
  fileSize: number;
  documentFiles: DocumentFile[];
}
