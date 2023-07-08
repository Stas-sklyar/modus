import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TrialCaseNarrativeStory } from '../../../models/interfaces/trial-case-narrative-story';
import { TrialCaseNarrativeStoryItem } from '../../../models/interfaces/trial-case-narrative-story-item';
import { UserComment } from '../../../models/interfaces/user-comment';
import { SetOrderItem } from '../../../models/interfaces/set-order-item';
import { SetOrderReqBody } from '../../../models/interfaces/set-order-request-body';
import { TrialCaseCardNote } from '../../../models/interfaces/trial-case-card-note';
import {
  TrialCaseNarrativeStoryPersonMention,
} from '../../../models/interfaces/trial-case-narrative-story-person-mention';
import {
  TrialCaseNarrativeStoryItemPersonMention,
} from '../../../models/interfaces/trial-case-narrative-story-item-person-mention';
import {
  TrialCaseNarrativeStoryItemDocument,
} from '../../../models/interfaces/trial-case-narrative-story-item-document';
import { guid } from 'odata-query';
import { TrialCaseNarrativeStoryUserComment } from '../../../models/interfaces/trial-case-narrative-story-user-comment';

@Injectable({
  providedIn: 'root',
})
export class CaseNarrativeEntitiesService {
  private _selectedNarrativeStory$ = new BehaviorSubject<TrialCaseNarrativeStory | null>(null);
  private _storyItems$ = new BehaviorSubject<TrialCaseNarrativeStoryItem[] | null>(null);
  private _comments$ = new BehaviorSubject<TrialCaseNarrativeStoryUserComment[] | null>(null);
  private _typeOfOpenAddStoryItemForm$ = new BehaviorSubject<'allegation' | 'fact' | 'note' | null>(null);
  get selectedNarrativeStory(): TrialCaseNarrativeStory | null {
    return this._selectedNarrativeStory$.getValue();
  }
  get selectedNarrativeStory$(): Observable<TrialCaseNarrativeStory | null> {
    return this._selectedNarrativeStory$
      .asObservable();
  }
  set selectedNarrativeStory(
    newNarrativeStory: TrialCaseNarrativeStory | null,
  ) {
    this._selectedNarrativeStory$.next(newNarrativeStory);
  }
  get storyItems$(): Observable<TrialCaseNarrativeStoryItem[] | null> {
    return this._storyItems$
      .asObservable();
  }
  get storyItems(): TrialCaseNarrativeStoryItem[] | null {
    return this._storyItems$.getValue();
  }
  set storyItems(storyItems: TrialCaseNarrativeStoryItem[] | null) {
    this._storyItems$.next(storyItems);
  }

  get comments$(): Observable<TrialCaseNarrativeStoryUserComment[] | null> {
    return this._comments$
      .asObservable();
  }
  set comments(comments: TrialCaseNarrativeStoryUserComment[] | null) {
    this._comments$.next(comments);
  }
  get typeOfOpenAddStoryItemForm$(): Observable<'allegation' | 'fact' | 'note' | null> {
    return this._typeOfOpenAddStoryItemForm$
      .asObservable();
  }
  set typeOfOpenAddStoryItemForm(type: 'allegation' | 'fact' | 'note' | null) {
    this._typeOfOpenAddStoryItemForm$.next(type);
  }
  constructor(
    private backendApiService: BackendApiService,
  ) { }

  createNarrativeStory(
    trialCaseId: string,
    title: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TrialCaseNarrativeStory> {
    const reqParams = {
      trialCaseId,
      title,
      description,
      personMentions: personMentions as TrialCaseNarrativeStoryPersonMention[],
    };

    return this.backendApiService.postEntity<TrialCaseNarrativeStory>('narrativeStory', reqParams);
  }

  fetchNarrativeStoryContent(
    narrativeStoryId: string,
  ): Observable<TrialCaseNarrativeStory> {
    this.selectedNarrativeStory = null;

    return this.backendApiService.getEntity<TrialCaseNarrativeStory>('narrativeStory', narrativeStoryId, {})
      .pipe(
        tap(story => this.selectedNarrativeStory = story),
      );
  }

  createNarrativeStoryItem(
    trialCaseNarrativeStoryId: string,
    title: string,
    description: string,
    type: string,
    trialCaseNarrativeStoryItemId: string | null,
    order: number,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TrialCaseNarrativeStoryItem> {
    const reqParams = {
      trialCaseNarrativeStoryId,
      title,
      description,
      type,
      trialCaseNarrativeStoryItemId,
      order,
      personMentions: personMentions as TrialCaseNarrativeStoryItemPersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TrialCaseNarrativeStoryItemDocument[],
      }),
    };

    return this.backendApiService.postEntity<TrialCaseNarrativeStoryItem>('narrativeStoryItems', reqParams);
  }

  deleteStoryItem(
    storyItemId: string,
  ): Observable<TrialCaseNarrativeStoryItem> {
    return this.backendApiService.deleteEntity<TrialCaseNarrativeStoryItem>('narrativeStoryItems', storyItemId);
  }

  updateNarrativeStory(
    narrativeStoryId: string,
    title: string,
    description: string,
    personMentions: { trialCasePersonId: string }[],
  ): Observable<TrialCaseNarrativeStory> {
    const reqParams = {
      title,
      description,
      personMentions: personMentions as TrialCaseNarrativeStoryPersonMention[],
    };
    return this.backendApiService.updateEntity<TrialCaseNarrativeStory>('narrativeStory', narrativeStoryId, reqParams);
  }

  updateStoryItem(
    storyItemId: string,
    title: string,
    parentStoryItemId: string | null,
    description: string,
    type: string,
    personMentions: { trialCasePersonId: string }[],
    uploadedDocuments: { documentId: string }[] | null,
  ): Observable<TrialCaseNarrativeStoryItem> {
    const reqParams = {
      title,
      trialCaseNarrativeStoryItemId: parentStoryItemId || undefined,
      description,
      type,
      personMentions: personMentions as TrialCaseNarrativeStoryItemPersonMention[],
      ...(uploadedDocuments && {
        documents: uploadedDocuments as TrialCaseNarrativeStoryItemDocument[],
      }),
    };
    return this.backendApiService.updateEntity<TrialCaseNarrativeStoryItem>('narrativeStoryItems', storyItemId, reqParams);
  }

  createComment(
    trialCaseNarrativeStoryId: string,
    comment: string,
  ): Observable<UserComment> {
    const reqParams = {
      message: comment,
      trialCaseNarrativeStoryUserComments: [
        {
          trialCaseNarrativeStoryId,
        },
      ],
    };

    // TODO: REMOVE "@ts-ignore"
    // @ts-ignore
    return this.backendApiService.postEntity<UserComment>('userComments', reqParams);
  }

  deleteNarrativeStory(
    narrativeStoryId: string,
  ): Observable<TrialCaseNarrativeStory> {
    return this.backendApiService.deleteEntity<TrialCaseNarrativeStory>('narrativeStory', narrativeStoryId);
  }

  updateStoryItemsOrder(
    notes: TrialCaseNarrativeStoryItem[],
  ): Observable<any> {
    let setOrderItemsList: SetOrderItem[] = [];
    notes.map((item: TrialCaseNarrativeStoryItem) => setOrderItemsList.push({ id: item.id, order: item.order }));

    const reqParams: SetOrderReqBody = {
      orderModel: [
        ...setOrderItemsList,
      ],
    };

    return this.backendApiService.sortEntities<TrialCaseCardNote>('sortNarrativeStoryItems', reqParams);
  }

  loadStoryItemsByNarrativeStoryId(
    narrativeStoryId: string,
  ): Observable<TrialCaseNarrativeStoryItem[]> {
    this.storyItems = null;

    return this.backendApiService.getEntitySet<TrialCaseNarrativeStoryItem>('narrativeStoryItems', {
      filter: {
        trialCaseNarrativeStoryId: guid(narrativeStoryId),
        isDeleted: false,
        trialCaseNarrativeStoryItemId: null,
      },
      expand: {
        items: {
          expand: {
            documents: {
              expand: {
                document: {},
              },
            },
          },
          filter: {
            isDeleted: false,
          },
        },
        documents: {
          expand: {
            document: {},
          },
        },
      },
    })
      .pipe(
        tap(storyItems => this.storyItems = storyItems),
      );
  }

  loadCommentsByNarrativeStoryId(
    narrativeStoryId: string,
  ): Observable<TrialCaseNarrativeStoryUserComment[]> {
    this.comments = null;

    return this.backendApiService.getEntitySet<TrialCaseNarrativeStoryUserComment>('narrativeStoryComment', {
      filter: {
        trialCaseNarrativeStoryId: guid(narrativeStoryId),
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

  eraseCurrentSelectedNarrativeStory(): void {
    this.selectedNarrativeStory = null;
  }

  sortStoryItems<T>(
    storyItems: { id: string; trialCaseNarrativeStoryItemId: string | null; order: number; }[],
  ): Observable<T> {
    return this.backendApiService.sortStoryItems<T>('sortStoryItems', storyItems);
  }
}
