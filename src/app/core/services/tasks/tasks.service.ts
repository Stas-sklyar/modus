import { Injectable } from '@angular/core';
import { TaskStatusEnum } from '../../../models/enums/task-status';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';
import { guid } from 'odata-query';
import { BackendApiService } from '../backend-api/backend-api.service';
import { UsersService } from '../users/users.service';
import { TrialCasesService } from '../trial-cases/trial-cases.service';
import { SortTypeEnum } from '../../../models/enums/sort-type';
import { SetOrderItem } from '../../../models/interfaces/set-order-item';
import { SetOrderReqBody } from '../../../models/interfaces/set-order-request-body';
import { UserComment } from '../../../models/interfaces/user-comment';
import { TrialCaseTaskDocument } from '../../../models/interfaces/trial-case-task-document';


@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _currentUserTasks$ = new BehaviorSubject<TrialCaseTask[] | null>(null);
  private _tasksOfSelectedCase$ = new BehaviorSubject<TrialCaseTask[] | null>(null);
  private _selectedTask$ = new BehaviorSubject<TrialCaseTask | null>(null);
  private _searchQuery$ = new BehaviorSubject<string | null>(null);
  private _dueDateFilter$ = new BehaviorSubject<string | null>(null);
  private _assignedToUserIdArr$ = new BehaviorSubject<string[] | null>(null);

  get currentUserTasks$(): Observable<TrialCaseTask[] | null> {
    return this._currentUserTasks$
      .asObservable();
  }
  set currentUserTasks(tasks: TrialCaseTask[] | null) {
    this._currentUserTasks$.next(tasks);
  }

  get tasksOfSelectedCase$(): Observable<TrialCaseTask[] | null> {
    return this._tasksOfSelectedCase$
      .asObservable();
  }
  set tasksOfSelectedCase(tasks: TrialCaseTask[] | null) {
    this._tasksOfSelectedCase$.next(tasks);
  }
  get selectedTask$(): Observable<TrialCaseTask | null> {
    return this._selectedTask$.asObservable();
  }
  set selectedTask(val: TrialCaseTask | null) {
    this._selectedTask$.next(val);
  }
  get searchQuery$(): Observable<string | null> {
    return this._searchQuery$.asObservable();
  }
  set searchQuery(query: string | null) {
    this._searchQuery$.next(query);
  }
  get dueDateFilter$(): Observable<string | null> {
    return this._dueDateFilter$.asObservable();
  }
  set dueDateFilter(type: string | null) {
    this._dueDateFilter$.next(type);
  }

  get assignedToUserIdArr$(): Observable<string[] | null> {
    return this._assignedToUserIdArr$.asObservable();
  }
  set assignedToUserIdArr(ids: string[] | null) {
    this._assignedToUserIdArr$.next(ids);
  }
  constructor(
    private backendApiService: BackendApiService,
    private usersService: UsersService,
    private trialCasesService: TrialCasesService,
  ) { }

  createTask(
    title: string,
    trialCaseId: string,
    order: number,
    description?: string,
    dueDate?: Date | null,
    assignedToUserId?: string | null,
    status?: TaskStatusEnum | null,
    trialCaseCardId?: string | null,
  ): Observable<TrialCaseTask> {
    const reqParams = {
      title,
      trialCaseId,
      order,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedToUserId: assignedToUserId || null,
      status: status || 'todo',
      trialCaseCardId: trialCaseCardId,
    };

    // @ts-ignore
    return this.backendApiService.postEntity<TrialCaseTask>('trialCaseTask', reqParams);
  }

  updateTask(
    taskId: string,
    title: string,
    trialCaseId: string,
    assignedToUserId: string | null,
    status: string | null,
    dueDate: string | null,
    description: string | null,
  ): Observable<TrialCaseTask> {
    const reqParams = {
      title,
      assignedToUserId: assignedToUserId || undefined,
      status: status || 'todo',
      dueDate,
      description: description || '',
      trialCaseId,
    };

    return this.backendApiService.updateEntity<TrialCaseTask>('trialCaseTask', taskId, reqParams);
  }

  updateStatusForTask(
    task: TrialCaseTask,
    status: string | null,
  ): Observable<TrialCaseTask> {
    const reqParams = { ...task, status: status || 'todo' };

    return this.backendApiService.updateEntity<TrialCaseTask>('trialCaseTask', task.id, reqParams);
  }

  loadTasksByUserId(currentUserId: string): Observable<TrialCaseTask[]> {
    return this.backendApiService.getEntitySet<TrialCaseTask>('trialCaseTask', {
      filter: {
        assignedToUserId: guid(currentUserId),
      },
      expand: {
        trialCase: {},
      },
    })
      .pipe(
        tap(currentUserTasks => this.currentUserTasks = currentUserTasks),
      );
  }

  loadTasksCreatedByUserId(currentUserId: string): Observable<TrialCaseTask[]> {
    return this.backendApiService.getEntitySet<TrialCaseTask>('trialCaseTask', {
      filter: {
        createdByUserId: guid(currentUserId),
      },
      expand: {
        trialCase: {},
      },
    });
  }

  taskIsOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;

    return new Date() > new Date(dueDate);
  }

  loadTasksByTrialCaseId(
    trialCaseId: string,
  ): Observable<TrialCaseTask[]> {
    const caseId = trialCaseId ? trialCaseId : (this.trialCasesService.selectedTrialCase?.id || '');

    this.currentUserTasks = null;

    return this.backendApiService.getEntitySet<TrialCaseTask>('trialCaseTask', {
      filter: {
        trialCaseId: guid(caseId),
      },
      expand: {
        assignedToUser: {},
      },
    })
      .pipe(
        tap(tasksOfSelectedCase => this.tasksOfSelectedCase = tasksOfSelectedCase),
      );
  }

  calcTaskStatus(dueDate: string | null, status: TaskStatusEnum | string): string {
    return this.taskIsOverdue(dueDate) ? 'overdue' : status;
  }
  getTask(id: string): Observable<TrialCaseTask> {
    return this.backendApiService.getEntity<TrialCaseTask>('trialCaseTask', id, {
      expand: {
        assignedToUser: {},
        createdByUser: {},
        comments: {
          expand: {
            userComment: {
              expand: {
                createdByUser: {},
              },
            },
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
        tap((task) => this.selectedTask = task),
      );
  }

  loadTasksByCardId(
    cardId: string,
  ): Observable<TrialCaseTask[]> {

    this.currentUserTasks = null;

    return this.backendApiService.getEntitySet<TrialCaseTask>('trialCaseTask', {
      filter: {
        trialCaseCardId: guid(cardId),
      },
      expand: {
        assignedToUser: {},
      },
    });
  }

  changeOrderForTasksArr(
    setOrderItems: SetOrderItem[],
  ): Observable<TrialCaseTask[]> {

    const reqParams: SetOrderReqBody = {
      orderModel: [
        ...setOrderItems,
      ],
    };

    return this.backendApiService.sortEntities<TrialCaseTask[]>(SortTypeEnum.SORT_TASKS, reqParams);
  }

  editTask(id: string, value: Partial<TrialCaseTask>): Observable<TrialCaseTask> {
    return this.backendApiService.updateEntity('trialCaseTask', id, value);
  }

  createTaskComment(message: string, trialCaseTaskId: string): Observable<UserComment> {
    const reqParams = {
      message,
      trialCaseTaskUserComments: [
        {
          trialCaseTaskId,
        },
      ],
    } as UserComment;

    return this.backendApiService.postEntity<UserComment>('userComments', reqParams);
  }

  attachDocument(
    trialCaseTaskId: string,
    uploadedDocuments: { documentId: string }[],
  ): Observable<TrialCaseTask> {
    const reqParams = {
      documents: uploadedDocuments as TrialCaseTaskDocument[],
    };

    return this.backendApiService.updateEntity<TrialCaseTask>('trialCaseTask', trialCaseTaskId, reqParams);
  }

  removeTask(trialCaseTaskId: string): Observable<TrialCaseTask> {
    return this.backendApiService.deleteEntity('trialCaseTask', trialCaseTaskId);
  }

  hasRelatedCardOrDocuments(task: TrialCaseTask): boolean {
    const relatedCard = task.trialCaseCard;
    const relatedDocuments = !!task.documents?.length;
    return !!(relatedCard || relatedDocuments);
  }
}
