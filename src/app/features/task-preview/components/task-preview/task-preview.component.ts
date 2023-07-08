import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Modal } from '../../../../models/enums/modal';
import { TasksFormModalComponent } from '../../../modals/components/tasks-form-modal/tasks-form-modal.component';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import {
  ConfirmationDialogModalComponent,
} from '../../../modals/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';

type Category = 'task' | 'comments' | 'documents';

@Component({
  selector: 'lr-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPreviewComponent implements OnInit, OnDestroy {
  openFrom: string = 'dashboard';
  backTo: string | null = null;
  selectedTask$ = this.tasksService.selectedTask$;
  selectedCategory$ = new BehaviorSubject<Category | null>(null);
  private unsubscribe$ = new Subject<void>();

  constructor(
    private bsModalService: BsModalService,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private trialCasesService: TrialCasesService,
  ) {}

  ngOnInit(): void {
    this.listenToQueryParams();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closePanel(): void {
    window.history.back();
  }

  openEditTaskModal(task: TrialCaseTask): void {
    const modalRef = this.bsModalService.show(TasksFormModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.Task,
      initialState: {
        modalType: 'edit',
        task,
        openFrom: this.openFrom || 'dashboard',
        taskId: task.id,
      },
      keyboard: true,
    });

    modalRef.onHide
      .pipe(
        switchMap(() => this.tasksService.getTask(task.id)),
        take(1),
      )
      .subscribe();
  }

  deleteTask(task: TrialCaseTask): void {
    const hasRelatedCardOrDocuments = this.tasksService.hasRelatedCardOrDocuments(task);

    this.bsModalService.show(ConfirmationDialogModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.DeleteTask,
      initialState: {
        ...(hasRelatedCardOrDocuments && {
          title: null,
          content: 'You cannot delete this task since it contains related card or attached documents.',
          confirmButtonText: null,
          cancelButtonText: 'OK',
        }),
      },
      keyboard: true,
    }).content?.confirm
      .pipe(
        switchMap(() => this.tasksService.removeTask(task.id)),
        tap(() => this.updateTasksList()),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.notificationsService.notifySuccess('Task has been removed');
      });
  }

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        tap((params) => {
          this.backTo = params.get('backTo');
        }),
        switchMap((params) => {
          const taskId = params.get('taskId');
          this.openFrom = params.get('openFrom') || 'dashboard';
          return taskId ? this.tasksService.getTask(taskId) : of(null);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.setInitialCategory();
      });
  }

  private setInitialCategory(): void {
    this.selectedCategory$.next('task');
  }

  updateTasksList(): void {
    if (this.openFrom === 'tasks') {
      this.updateTasksPage();
    } else {
      this.updateDashboardPage();
    }
  }

  updateTasksPage(): void {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.tasksService.loadTasksByTrialCaseId(selectedCaseId || '')
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: () => {
          this.closePanel();
        },
        error: () => {
          this.notificationsService.notifyError('An error occurred while updating tasks list');
          console.error('An error occurred while updating tasks list');
        },
      });
  }

  updateDashboardPage(): void {
    this.usersService.getCurrentAppUser()
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: () => {
          this.closePanel();
        },
        error: () => {
          this.notificationsService.notifyError('An error occurred while updating tasks list');
          console.error('An error occurred while updating tasks list');
        },
      });
  }
}
