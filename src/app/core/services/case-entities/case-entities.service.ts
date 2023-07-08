import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { CASE_FOLDER_ACCESS_LEVEL } from '../../../models/aliases/case-folder-access-level.type';
import { TrialCaseFolder } from '../../../models/interfaces/trial-case-folder';
import { TrialCaseCard } from '../../../models/interfaces/trial-case-card';
import { TrialCaseSection } from '../../../models/interfaces/trial-case-section';
import { TrialCaseSubsection } from '../../../models/interfaces/trial-case-subsection';
import { TrialCaseCardNote } from '../../../models/interfaces/trial-case-card-note';
import { UserComment } from '../../../models/interfaces/user-comment';
import { TrialCaseCardNotePersonMention } from '../../../models/interfaces/trial-case-card-note-person-mention';
import { TrialCaseCardPersonMention } from '../../../models/interfaces/trial-case-card-person-mention';
import { SetOrderItem } from '../../../models/interfaces/set-order-item';
import { SetOrderReqBody } from '../../../models/interfaces/set-order-request-body';
import { SortTypeEnum } from '../../../models/enums/sort-type';
import { TrialCaseCardNoteDocument } from '../../../models/interfaces/trial-case-card-note-document';
import { guid } from 'odata-query';
import { TrialCaseCardUserComment } from '../../../models/interfaces/trial-case-card-user-comment';

@Injectable({
  providedIn: 'root',
})
export class CaseEntitiesService {

  private _expandedWorkbookFolderId$ = new BehaviorSubject<string | null>(null);
  private _openedAddContentMenuItemType$ = new BehaviorSubject<string | null>(null);
  private _expandedWorkbookSubsectionId$ = new BehaviorSubject<string | null>(null);
  private _selectedCard$ = new BehaviorSubject<TrialCaseCard | null>(null);
  private _folders$ = new BehaviorSubject<TrialCaseFolder[] | null>(null);
  private _selectedSection$ = new BehaviorSubject<TrialCaseSection | null>(null);
  private _subSections$ = new BehaviorSubject<TrialCaseSubsection[] | null>(null);
  private _notes$ = new BehaviorSubject<TrialCaseCardNote[] | null>(null);
  private _comments$ = new BehaviorSubject<TrialCaseCardUserComment[] | null>(null);

  get expandedWorkbookFolderId(): string | null {
    return this._expandedWorkbookFolderId$.getValue();
  }
  get expandedWorkbookFolderId$(): Observable<string | null> {
    return this._expandedWorkbookFolderId$
      .asObservable();
  }
  set expandedWorkbookFolderId(id: string | null) {
    this._expandedWorkbookFolderId$.next(id);
  }
  get openedAddContentMenuItemType$(): Observable<string | null> {
    return this._openedAddContentMenuItemType$
      .asObservable();
  }
  set openedAddContentMenuItemType(menuItemType: string | null) {
    this._openedAddContentMenuItemType$.next(menuItemType);
  }
  get expandedWorkbookSubsectionId(): string | null {
    return this._expandedWorkbookSubsectionId$.getValue();
  }
  get expandedWorkbookSubsectionId$(): Observable<string | null> {
    return this._expandedWorkbookSubsectionId$
      .asObservable();
  }
  set expandedWorkbookSubsectionId(id: string | null) {
    this._expandedWorkbookSubsectionId$.next(id);
  }
  get selectedCard$(): Observable<TrialCaseCard | null> {
    return this._selectedCard$
      .asObservable();
  }
  set selectedCard(newCard: TrialCaseCard | null) {
    this._selectedCard$.next(newCard);
  }
  get folders$(): Observable<TrialCaseFolder[] | null> {
    return this._folders$
      .asObservable();
  }
  set folders(folders: TrialCaseFolder[] | null) {
    this._folders$.next(folders);
  }
  get selectedSection$(): Observable<TrialCaseSection | null> {
    return this._selectedSection$
      .asObservable();
  }
  get selectedSection(): TrialCaseSection | null {
    return this._selectedSection$.getValue();
  }
  set selectedSection(section: TrialCaseSection | null) {
    this._selectedSection$.next(section);
  }
  get subSections$(): Observable<TrialCaseSubsection[] | null> {
    return this._subSections$
      .asObservable();
  }
  set subSections(subSections: TrialCaseSubsection[] | null) {
    this._subSections$.next(subSections);
  }
  get notes$(): Observable<TrialCaseCardNote[] | null> {
    return this._notes$
      .asObservable();
  }
  get notes(): TrialCaseCardNote[] | null {
    return this._notes$.getValue();
  }
  set notes(notes: TrialCaseCardNote[] | null) {
    this._notes$.next(notes);
  }
  get comments$(): Observable<TrialCaseCardUserComment[] | null> {
    return this._comments$
      .asObservable();
  }
  set comments(comments: TrialCaseCardUserComment[] | null) {
    this._comments$.next(comments);
  }

  constructor(
    private backendApiService: BackendApiService,
  ) { }

  fetchCardContent(
    cardId: number | string,
  ): Observable<TrialCaseCard> {
    this.selectedCard = null;

    return this.backendApiService.getEntity<TrialCaseCard>('card', cardId, {})
      .pipe(
        tap(card => this.selectedCard = card),
      );
  }

  loadFolderContent(
    folderId: string,
  ): Observable<TrialCaseFolder> {
    return this.backendApiService.getEntity<TrialCaseFolder>('workbookFolder', folderId, {
      expand: {
        sections: {},
      },
    });
  }

  loadSectionContent(
    sectionId: string,
  ): Observable<TrialCaseSection> {
    this.selectedSection = null;

    return this.backendApiService.getEntity<TrialCaseSection>('workbookSection', sectionId, {})
      .pipe(
        tap(section => this.selectedSection = section),
      );
  }

  loadSubsectionContent(
    subsectionId: string,
  ): Observable<TrialCaseSubsection> {
    return this.backendApiService.getEntity<TrialCaseSubsection>('workbookSubsection', subsectionId);
  }

  eraseCurrentCard(): void {
    this.selectedCard = null;
  }


  // TODO ALL CREATE/UPDATE METHODS SHOULD BE REFACTORED

  // TODO: FIX accessLevel after API fix
  createWorkbookFolder(
    trialCaseId: string,
    name: string,
    description: string,
    accessLevel: CASE_FOLDER_ACCESS_LEVEL,
  ): Observable<TrialCaseFolder> {
    const reqParams = {
      name,
      description,
      trialCaseId,
    };
    return this.backendApiService.postEntity<TrialCaseFolder>('workbookFolder', reqParams);
  }

  createWorkbookSection(
    workbookFolderId: string,
    name: string,
    description: string,
  ): Observable<TrialCaseSection> {
    const reqParams = {
      name,
      description,
      trialCaseFolderId: workbookFolderId,
    };

    return this.backendApiService.postEntity<TrialCaseSection>('workbookSection', reqParams);
  }

  createWorkbookSubsection(
    workbookSectionId: string,
    name: string,
  ): Observable<TrialCaseSubsection> {
    const reqParams = {
      name,
      trialCaseSectionId: workbookSectionId,
    };

    return this.backendApiService.postEntity<TrialCaseSubsection>('workbookSubsection', reqParams);
  }

  createCard(
    parentId: string,
    attachTo: 'workbook' | 'notebook',
    name: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TrialCaseCard> {
    const reqParams = {
      ...(attachTo === 'workbook' ? { trialCaseSubsectionId: parentId } : { trialNotebookSectionId: parentId }),
      name,
      description,
      personMentions: personMentions as TrialCaseCardPersonMention[],
    };

    return this.backendApiService.postEntity<TrialCaseCard>('card', reqParams);
  }

  createNote(
    cardId: string,
    title: string,
    description: string,
    order: number,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TrialCaseCardNote> {
    const reqParams = {
      title,
      description,
      cardId,
      order,
      personMentions: personMentions as TrialCaseCardNotePersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TrialCaseCardNoteDocument[],
      }),
    };

    return this.backendApiService.postEntity<TrialCaseCardNote>('cardNote', reqParams);
  }

  createComment(
    trialCaseCardId: string,
    comment: string,
  ): Observable<UserComment> {
    const reqParams = {
      message: comment,
      trialCaseCardUserComments: [
        {
          trialCaseCardId,
        },
      ],
    };

    // TODO: REMOVE "@ts-ignore"
    // @ts-ignore
    return this.backendApiService.postEntity<UserComment>('userComments', reqParams);
  }

  // TODO: FIX accessLevel after API fix
  updateWorkbookFolder(
    folderId: string,
    name: string,
    description: string,
    accessLevel: CASE_FOLDER_ACCESS_LEVEL,
  ): Observable<TrialCaseFolder> {
    const reqParams = {
      name,
      description,
    };
    return this.backendApiService.updateEntity<TrialCaseFolder>('workbookFolder', folderId, reqParams);
  }

  updateWorkbookSection(
    sectionId: string,
    name: string,
    description: string,
  ): Observable<TrialCaseSection> {
    const reqParams = {
      name,
      description,
    };
    return this.backendApiService.updateEntity<TrialCaseSection>('workbookSection', sectionId, reqParams);
  }

  updateWorkbookSubsection(
    subsectionId: string,
    name: string,
  ): Observable<TrialCaseSubsection> {
    const reqParams = {
      name,
    };
    return this.backendApiService.updateEntity<TrialCaseSubsection>('workbookSubsection', subsectionId, reqParams);
  }

  updateWorkbookCard(
    cardId: string,
    name: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TrialCaseCard> {
    const reqParams = {
      name,
      description,
      personMentions: personMentions as TrialCaseCardPersonMention[],
    };
    return this.backendApiService.updateCard<TrialCaseCard>('card', cardId, reqParams);
  }

  updateCardNote(
    noteId: string,
    title: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TrialCaseCardNote> {
    const reqParams = {
      title,
      description,
      personMentions: personMentions as TrialCaseCardNotePersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TrialCaseCardNoteDocument[],
      }),
    };

    return this.backendApiService.updateEntity<TrialCaseCardNote>('cardNote', noteId, reqParams);
  }

  deleteWorkbookCard(
    cardId: string,
  ): Observable<TrialCaseCard> {
    return this.backendApiService.deleteEntity<TrialCaseCard>('card', cardId);
  }

  deleteCardNote(
    noteId: string,
  ): Observable<TrialCaseCardNote> {
    return this.backendApiService.deleteEntity<TrialCaseCardNote>('cardNote', noteId);
  }

  updateCardNotesOrder(
    entitiesArr: TrialCaseCardNote[],
  ): Observable<any> {
    let setOrderItemsList: SetOrderItem[] = [];
    entitiesArr.map((item: TrialCaseCardNote) => setOrderItemsList.push({ id: item.id, order: item.order }));

    const reqParams: SetOrderReqBody = {
      orderModel: [
        ...setOrderItemsList,
      ],
    };

    return this.backendApiService.sortEntities<TrialCaseCardNote>('sortCardNotes', reqParams);
  }

  sortCaseEntities<T>(
    entities: any[],
    sortType: SortTypeEnum,
  ): Observable<T> {
    let setOrderItemsList: SetOrderItem[] = [];
    entities.map((item, index: number) => setOrderItemsList.push({ id: item.id, order: index }));

    const reqParams: SetOrderReqBody = {
      orderModel: [
        ...setOrderItemsList,
      ],
    };

    return this.backendApiService.sortEntities<T>(sortType, reqParams);
  }

  loadFoldersByTrialCaseId(
    trialCaseId: string,
  ): Observable<TrialCaseFolder[]> {
    this.folders = null;

    return this.backendApiService.getEntitySet<TrialCaseFolder>('workbookFolder', {
      filter: {
        trialCaseId: guid(trialCaseId),
        isDeleted: false,
      },
      expand: {
        sections: {},
      },
    })
      .pipe(
        tap(folders => this.folders = folders),
      );
  }

  loadSubsectionsBySectionId(
    sectionId: string,
  ): Observable<TrialCaseSubsection[]> {
    this.subSections = null;

    return this.backendApiService.getEntitySet<TrialCaseSubsection>('workbookSubsection', {
      filter: {
        trialCaseSectionId: guid(sectionId),
        isDeleted: false,
      },
      expand: {
        cards: {
          expand: {
            personMentions: {},
          },
        },
      },
    })
      .pipe(
        tap(subSections => this.subSections = subSections),
      );
  }

  loadNotesByCardId(
    cardId: string,
  ): Observable<TrialCaseCardNote[]> {
    this.notes = null;

    return this.backendApiService.getEntitySet<TrialCaseCardNote>('cardNote', {
      filter: {
        cardId: guid(cardId),
        isDeleted: false,
      },
      expand: {
        documents: {
          expand: {
            document: {},
          },
        },
        createdByUser: {},
        modifiedByUser: {},
      },
    })
      .pipe(
        tap(notes => this.notes = notes),
      );
  }

  loadCommentsByCardId(
    cardId: string,
  ): Observable<TrialCaseCardUserComment[]> {
    this.comments = null;

    return this.backendApiService.getEntitySet<TrialCaseCardUserComment>('cardComment', {
      filter: {
        trialCaseCardId: guid(cardId),
      },
      expand: {
        userComment: {
          expand: {
            createdByUser: {},
          },
        },
      },
    })
      .pipe(
        tap(comments => this.comments = comments),
      );
  }
}
