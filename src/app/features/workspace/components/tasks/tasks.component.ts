import { AfterViewChecked, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TasksFormModalComponent } from '../../../modals/components/tasks-form-modal/tasks-form-modal.component';
import { Router } from '@angular/router';
import { TaskBoardColumn } from '../../../../models/interfaces/task-board-column';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TaskStatusEnum } from '../../../../models/enums/task-status';
import { DataAddEvent } from '@progress/kendo-angular-sortable/data-events';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { SetOrderItem } from '../../../../models/interfaces/set-order-item';

@Component({
  selector: 'lr-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, AfterViewChecked, OnDestroy {

  selectedCase$ = this.casesSrv.selectedTrialCase$;
  tasksGroupedByStatus$ = new BehaviorSubject<TaskBoardColumn[] | null>(null);
  defaultTasksList$ = new BehaviorSubject<TaskBoardColumn[] | null>(null);
  searchQuery$ = new BehaviorSubject('');
  dueDateFilter$ = new BehaviorSubject<string | null>(null);
  assignedToUserIdArr$ = new BehaviorSubject<string[] | null>(null);
  private _subscription = new Subscription();
  cardWidth: number = 0;
  dragAndDropEventInProgress = new BehaviorSubject(false);

  constructor(
    private casesSrv: TrialCasesService,
    private bsModalService: BsModalService,
    private router: Router,
    public tasksService: TasksService,
    private trialCasesService: TrialCasesService,
    private notificationsSrv: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.subscribeToChangeSelectedTrialCase();
    this.initSubscribers();
  }

  ngAfterViewChecked(): void {
    this.cardWidth = this.calcTaskCardWidth();
  }

  subscribeToChangeSelectedTrialCase(): void {
    this._subscription.add(
      this.trialCasesService.selectedTrialCase$
        .subscribe({
          next: selectedCase => {
            if (selectedCase) {
              this.loadTasksByTrialCaseId(selectedCase.id);
            }
          },
          error: () => {
            console.error('An error occurred while receiving current selected Case');
            this.notificationsSrv.notifyError('An error occurred while receiving current selected Case');
          },
        }),
    );
  }

  initSubscribers(): void {
    this._subscription.add(
      this.tasksService.searchQuery$.subscribe({
        next: (query) => {
          this.searchQuery$.next(query || '');
        },
      }),
    );

    this._subscription.add(
      this.tasksService.dueDateFilter$.subscribe({
        next: (dueDateFilter) => {
          this.dueDateFilter$.next(dueDateFilter || null);
        },
      }),
    );

    this._subscription.add(
      this.tasksService.tasksOfSelectedCase$.subscribe({
        next: tasksByTrialCaseId => {
          this.calcTasksGroupedByStatus(tasksByTrialCaseId || []);
        },
      }),
    );

    this._subscription.add(
      this.tasksService.assignedToUserIdArr$.subscribe({
        next: (ids) => {
          console.log(ids);
          this.assignedToUserIdArr$.next(ids || null);
        },
      }),
    );
  }

  loadTasksByTrialCaseId(trialCaseId: string): void {
    this._subscription.add(
      this.tasksService.loadTasksByTrialCaseId(trialCaseId)
        .subscribe({
          next: tasksByTrialCaseId => {
            this.calcTasksGroupedByStatus(tasksByTrialCaseId);
          },
          error: () => {
            console.error('An error occurred while receiving tasks list');
            this.notificationsSrv.notifyError('An error occurred while receiving tasks list');
            this.tasksGroupedByStatus$.next([]);
            this.defaultTasksList$.next([]);
          },
        }),
    );
  }

  calcTasksGroupedByStatus(tasksByTrialCaseId: TrialCaseTask[]): void {
    const todoTasks = tasksByTrialCaseId.filter(task => task.status === 'todo');
    const inProgressTasks = tasksByTrialCaseId.filter(task => task.status === 'in-progress');
    const completedTasks = tasksByTrialCaseId.filter(task => task.status === 'completed');

    let tasksGroupedByStatus: TaskBoardColumn[] = [];

    tasksGroupedByStatus.push({
      columnTitle: 'Not started',
      tasks: todoTasks,
      status: 'todo',
      amountOfTasks: todoTasks.length,
    });

    tasksGroupedByStatus.push({
      columnTitle: 'In Progress',
      tasks: inProgressTasks,
      status: 'in-progress',
      amountOfTasks: inProgressTasks.length,
    });

    tasksGroupedByStatus.push({
      columnTitle: 'Completed',
      tasks: completedTasks,
      status: 'completed',
      amountOfTasks: completedTasks.length,
    });

    this.tasksGroupedByStatus$.next(tasksGroupedByStatus);
    this.defaultTasksList$.next(JSON.parse(JSON.stringify(tasksGroupedByStatus)));
  }
  openCreateTaskModal(taskStatus: string, orderForNewTasks: number): void {
    let status: TaskStatusEnum;

    if (taskStatus === 'todo') {
      status = TaskStatusEnum.TODO;
    } else if (taskStatus === 'in-progress') {
      status = TaskStatusEnum.IN_PROGRESS;
    } else {
      status = TaskStatusEnum.COMPLETED;
    }

    this.bsModalService.show(TasksFormModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        modalType: 'create',
        newTaskStatus: status,
        openFrom: 'tasks',
        order: orderForNewTasks,
      },
      keyboard: true,
    });
  }

  openTaskPreviewModal(taskId: string): void {
    if (this.dragAndDropEventInProgress.getValue()) return;

    this.router.navigate([], { queryParams: {
      taskId, backTo: 'Tasks', openFrom: 'tasks',
    } });
  }

  changeTaskStatus($event: DataAddEvent, status: string): void {
    // TODO: REMOVE @TS-IGNORE
    // @ts-ignore
    const task: TrialCaseTask = $event.dataItem;

    this.tasksService.updateStatusForTask(task, status)
      .subscribe({
        next: () => {
          this.updateTasksOrder();
        },
        error: () => {
          console.error('An error occurred while updating task status');
          this.notificationsSrv.notifyError('An error occurred while updating task status');
        },
      });
  }

  updateTasksOrder(): void {
    let setOrderItems: SetOrderItem[] = [];
    const resultTasksArr = this.tasksGroupedByStatus$.getValue();

    for (const item of resultTasksArr || []) {
      for (let i = 0; i < item.tasks.length; i++) {
        setOrderItems.push({ id: item.tasks[i].id, order: i });
      }
    }

    this.tasksService.changeOrderForTasksArr(setOrderItems)
      .subscribe({
        next: () => {
          this.dragAndDropEventInProgress.next(false);
          // this.recalculateNumberOfTasksForColumns();
        },
        error: () => {
          console.error('An error occurred while updating tasks order');
          this.notificationsSrv.notifyError('An error occurred while updating tasks order');
        },
      });
  }

  calcTaskCardWidth(): number {
    const taskCardElements = document.getElementsByClassName('task-card');
    // @ts-ignore
    return taskCardElements[taskCardElements.length - 1]?.offsetWidth || 300;
  }

  recalculateNumberOfTasksForColumns(): void {
    const copyOfTasksGroupedByStatus = this.tasksGroupedByStatus$.getValue();

    if (copyOfTasksGroupedByStatus) {
      const todoTasks = copyOfTasksGroupedByStatus.filter(item => item.status === 'todo')[0].tasks;
      const inProgressTasks = copyOfTasksGroupedByStatus.filter(item => item.status === 'in-progress')[0].tasks;
      const completedTasks = copyOfTasksGroupedByStatus.filter(item => item.status === 'completed')[0].tasks;

      copyOfTasksGroupedByStatus.filter(item => item.status === 'todo')[0].amountOfTasks = todoTasks.length;
      copyOfTasksGroupedByStatus.filter(item => item.status === 'in-progress')[0].amountOfTasks = inProgressTasks.length;
      copyOfTasksGroupedByStatus.filter(item => item.status === 'completed')[0].amountOfTasks = completedTasks.length;

      this.tasksGroupedByStatus$.next(JSON.parse(JSON.stringify(copyOfTasksGroupedByStatus)));
    }

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.tasksGroupedByStatus$.next([]);
    this.defaultTasksList$.next([]);
  }
}
