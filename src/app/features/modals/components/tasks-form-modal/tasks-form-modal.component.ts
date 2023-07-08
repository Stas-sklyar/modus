import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskForm } from '../../../../models/interfaces/task-form';
import { Subscription } from 'rxjs';
import { TaskStatusEnum } from '../../../../models/enums/task-status';
import { UsersService } from '../../../../core/services/users/users.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { TasksService } from '../../../../core/services/tasks/tasks.service';

@Component({
  selector: 'lr-tasks-form-modal',
  templateUrl: './tasks-form-modal.component.html',
  styleUrls: ['./tasks-form-modal.component.scss'],
})
export class TasksFormModalComponent implements OnInit, OnDestroy {
  @Input() modalType: 'create' | 'edit' = 'create';
  @Input() task!: TrialCaseTask;
  @Input() newTaskStatus!: TaskStatusEnum;
  @Input() caseInputIsVisible!: boolean;
  @Input() openFrom!: string;
  @Input() order!: number;
  @Input() taskId!: string;
  form = new FormGroup<TaskForm>({
    title: new FormControl('', Validators.required),
    trialCaseId: new FormControl(null, Validators.required),
    assignedToUserId: new FormControl(null, Validators.required),
    status: new FormControl(null),
    dueDate: new FormControl(null),
    description: new FormControl(''),
  });

  users$ = this.usersService.users$;
  trialCases$ = this.trialCasesService.trialCases$;
  private _subscription = new Subscription();
  constructor(
    private bsModalRef: BsModalRef,
    private tasksService: TasksService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private trialCasesService: TrialCasesService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllTrialCases();

    if (this.modalType === 'edit') {
      this.setFormValues(this.task);
    } else {
      const selectedCaseId = this.trialCasesService.selectedTrialCase?.id;
      this.form.get('trialCaseId')?.setValue(selectedCaseId || '');
    }

    if (this.newTaskStatus) {
      this.form.get('status')?.setValue(this.newTaskStatus);
    }
  }

  loadUsers(): void {
    this._subscription.add(
      this.usersService.getUsers()
        .subscribe({
          error: (error) => {
            console.error(error);
            this.notificationsService.notifyError('An error occurred when receiving the users list');
          },
        }),
    );
  }

  loadAllTrialCases(): void {
    this._subscription.add(
      this.trialCasesService.getTrialCases()
        .subscribe({
          error: () => {
            this.notificationsService.notifyError('An error occurred while receiving trial cases list');
          },
        }),
    );
  }

  setFormValues(task: TrialCaseTask): void {
    let trialCaseStatus: TaskStatusEnum;

    trialCaseStatus = task.status === 'todo' ? TaskStatusEnum.TODO : task.status === 'in-progress' ? TaskStatusEnum.IN_PROGRESS : TaskStatusEnum.COMPLETED;

    this.form.get('title')?.setValue(task.title);
    this.form.get('assignedToUserId')?.setValue(task.assignedToUserId);
    this.form.get('status')?.setValue(trialCaseStatus);
    this.form.get('dueDate')?.setValue(task.dueDate?.substring(0, 10) || null);
    this.form.get('description')?.setValue(task.description);
    this.form.get('trialCaseId')?.setValue(task.trialCaseId);
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createTask(): void {
    const {
      title,
      assignedToUserId,
      status,
      dueDate,
      description,
      trialCaseId,
    } = this.form.value;

    if (title && trialCaseId && assignedToUserId !== null) {
      this._subscription.add(
        this.tasksService.createTask(
          title,
          trialCaseId,
          this.order || 0,
          description || '',
          dueDate ? new Date(dueDate) : null,
          assignedToUserId || null,
          status || TaskStatusEnum.TODO,
        )
          .subscribe({
            next: () => {
              this.closeModal();
              this.updateTasksList();
              this.notificationsService.notifySuccess('New Task successfully created');
            },
            error: () => {
              this.notificationsService.notifyError('An error occurred when creating the Task');
            },
          }),
      );
    }
  }

  editTask(): void {
    const {
      title,
      assignedToUserId,
      status,
      dueDate,
      description,
      trialCaseId,
    } = this.form.value;

    if (title && trialCaseId) {
      this._subscription.add(
        this.tasksService.updateTask(
          this.task.id,
          title,
          trialCaseId,
          assignedToUserId ? assignedToUserId : null,
          status ? status : TaskStatusEnum.TODO,
          dueDate ? new Date(dueDate).toISOString() : null,
          description ? description : '',
        )
          .subscribe({
            next: () => {
              this.updateTasksList();
              this.updateTaskModal();
              this.notificationsService.notifySuccess('Task has been successfully edited');
            },
          }),
      );
    } else {
      this.notificationsService.notifyError('Task title is required');
    }
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

    this._subscription.add(
      this.tasksService.loadTasksByTrialCaseId(selectedCaseId || '')
        .subscribe({
          next: () => {
            this.closeModal();
          },
          error: () => {
            this.notificationsService.notifyError('An error occurred while updating tasks list');
            console.error('An error occurred while updating tasks list');
          },
        }),
    );
  }

  updateDashboardPage(): void {
    this._subscription.add(
      this.usersService.getCurrentAppUser()
        .subscribe({
          next: () => {
            this.closeModal();
          },
          error: () => {
            this.notificationsService.notifyError('An error occurred while updating tasks list');
            console.error('An error occurred while updating tasks list');
          },
        }),
    );
  }

  updateTaskModal(): void {
    this._subscription.add(
      this.tasksService.getTask(this.taskId)
        .subscribe({
          next: () => {
            this.updateTasksList();
          },
          error: () => {
            this.notificationsService.notifyError('An error occurred while updating task modal window');
            console.error('An error occurred while updating tasks list');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
