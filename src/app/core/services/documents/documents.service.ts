import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { DocumentFolder } from '../../../models/interfaces/document-folder';
import { Document } from '../../../models/interfaces/document';
import { WithCounters } from '../../../models/interfaces/withCounters';
import { TrialCasesService } from '../trial-cases/trial-cases.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  private _documentFolders$ = new BehaviorSubject<Array<DocumentFolder & WithCounters> | null>(null);
  get documentFolders$(): Observable<Array<DocumentFolder & WithCounters> | null> {
    return this._documentFolders$.asObservable();
  }
  get documentFolders(): Array<DocumentFolder & WithCounters> | null {
    return this._documentFolders$.getValue();
  }
  set documentFolders(val: Array<DocumentFolder & WithCounters> | null) {
    this._documentFolders$.next(val);
  }

  private _selectedFolder$ = new BehaviorSubject<(DocumentFolder & WithCounters) | null>(null);
  get selectedFolder$(): Observable<(DocumentFolder & WithCounters) | null> {
    return this._selectedFolder$.asObservable();
  }
  get selectedFolder(): (DocumentFolder & WithCounters) | null {
    return this._selectedFolder$.getValue();
  }
  set selectedFolder(val: (DocumentFolder & WithCounters) | null) {
    this._selectedFolder$.next(val);
  }

  private _documents$ = new BehaviorSubject<Document[] | null>(null);
  get documents$(): Observable<Document[] | null> {
    return this._documents$.asObservable();
  }
  set documents(val: Document[] | null) {
    this._documents$.next(val);
  }

  private _selectedDocument$ = new BehaviorSubject<Document | null>(null);
  get selectedDocument$(): Observable<Document | null> {
    return this._selectedDocument$.asObservable();
  }
  set selectedDocument(val: Document | null) {
    this._selectedDocument$.next(val);
  }

  private _uploadedDocumentsBuffer$ = new BehaviorSubject<Document[] | null>(null);
  get uploadedDocumentsBuffer$(): Observable<Document[] | null> {
    return this._uploadedDocumentsBuffer$.asObservable();
  }
  get uploadedDocumentsBuffer(): Document[] | null {
    return this._uploadedDocumentsBuffer$.getValue();
  }
  set uploadedDocumentsBuffer(val: Document[] | null) {
    this._uploadedDocumentsBuffer$.next(val);
  }

  constructor(
    private backendApiService: BackendApiService,
    private trialCaseService: TrialCasesService,
  ) { }

  createComment(
    documentId: string,
    comment: string,
  ): Observable<any> {
    const reqParams = {
      message: comment,
      documentUserComments: [
        {
          documentId,
        },
      ],
    };
    return this.backendApiService.postEntity('userComments', reqParams);
  }

  changeDocument(
    documentId: string,
    reqParams: FormData,
  ): Observable<Document | null> {
    return this.backendApiService.editDocument<Document>('documents', documentId, reqParams);
  }

  createFolder(
    trialCaseId: string,
    name: string,
  ): Observable<DocumentFolder> {
    const reqParams = {
      name,
      trialCaseId,
    };
    return this.backendApiService.postEntity<DocumentFolder>('documentFolders', reqParams);
  }

  editFolder(
    folderId: string,
    name: string,
  ): Observable<DocumentFolder> {
    const reqParams = {
      name,
    };
    return this.backendApiService.updateEntity<DocumentFolder>('documentFolders', folderId, reqParams);
  }

  cleanMediaLibrary(): void {
    this.documentFolders = null;
    this.selectedFolder = null;
    this.documents = null;
    this.selectedDocument = null;
  }

  deleteDocument(
    documentId: string,
  ): Observable<any> {
    return this.backendApiService.deleteEntity('documents', documentId);
  }

  deleteFolder(
    folderId: string,
  ): Observable<any> {
    return this.backendApiService.deleteEntity('documentFolders', folderId);
  }

  getFileBlob(
    id: string,
  ): Observable<any> {
    return this.backendApiService.loadFile(id);
  }

  fetchDocumentFolders(): Observable<Array<DocumentFolder & WithCounters> | null> {
    return this.trialCaseService.selectedTrialCase$
      .pipe(
        filter((selectedTrialCase) => !!selectedTrialCase),
        switchMap((selectedTrialCase) => {
          return this.backendApiService.getEntitySet<DocumentFolder & WithCounters>('documentFolders', {
            expand: {
              documents: {
                count: true,
                filter: {
                  isDeleted: false,
                },
              },
            },
            filter: {
              trialCaseId: {
                eq: {
                  type: 'guid',
                  value: selectedTrialCase?.id,
                },
              },
            },
          });
        }),
        tap((folders) => this.documentFolders = folders),
      );
  }

  fetchAllDocuments(folderId: string | null): Observable<Document[] | null> {
    return this.trialCaseService.selectedTrialCase$
      .pipe(
        filter((selectedTrialCase) => !!selectedTrialCase),
        switchMap((selectedTrialCase) => {
          const queryParams = {
            expand: {
              parent: {},
            },
            filter: {
              documentFolder: {
                trialCaseId: {
                  eq: {
                    type: 'guid',
                    value: selectedTrialCase?.id,
                  },
                },
              },
              ...(folderId && {
                documentFolderId: {
                  eq: {
                    type: 'guid',
                    value: folderId,
                  },
                },
              }),
            },
          };
          return this.backendApiService.getEntitySet<Document>('documents', queryParams);
        }),
        tap((documents) => this.documents = documents),
      );
  }

  fetchDocs(): Observable<Document[] | null> {
    const queryParams = {};

    return this.backendApiService.getEntitySet<Document>('documents', queryParams)
      .pipe(
        tap((documents) => this.documents = documents),
      );
  }

  fetchDocument(id: string): Observable<Document | null> {
    return this.backendApiService.getEntity<Document>('documents', id, {
      expand: {
        comments: {
          expand: {
            userComment: {
              expand: {
                createdByUser: {},
              },
            },
          },
        },
        parent: {},
        files: {
          expand: {
            file: {
              filter: {
                isDeleted: true,
              },
            },
          },
        },
        documents: {
          expand: {
            files: {
              expand: {
                file: {},
              },
            },
          },
        },
      },
    })
      .pipe(
        tap((document) => this.selectedDocument = document),
      );
  }

  uploadFile(reqParams: FormData): Observable<Document | null> {
    return this.backendApiService.uploadFile(reqParams);
  }

  clearDocumentsBuffer(): void {
    this.uploadedDocumentsBuffer = null;
  }

}
