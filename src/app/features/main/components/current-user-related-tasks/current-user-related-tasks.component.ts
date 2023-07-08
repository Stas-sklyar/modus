import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { UsersService } from '../../../../core/services/users/users.service';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { Router, RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago/time-ago.pipe';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-current-user-related-tasks',
  standalone: true,
  templateUrl: './current-user-related-tasks.component.html',
  styleUrls: ['./current-user-related-tasks.component.scss'],
  imports: [
    RouterLink,
    TimeAgoPipe,
    AsyncPipe,
    NgIf,
    NgForOf,
  ],
})
export class CurrentUserRelatedTasksComponent implements OnInit, OnDestroy {
  tasksFilters$ = new BehaviorSubject<'assignedToMe' | 'createdByMe'>('assignedToMe');
  assignedToCurrentUserTasks$ = new BehaviorSubject<TrialCaseTask[] | null>(null);
  tasksCreatedByCurrentUser$ = new BehaviorSubject<TrialCaseTask[] | null>(null);
  private _subscription = new Subscription();
  appRoutes = AppRoutes;
  constructor(
    public tasksService: TasksService,
    private usersService: UsersService,
    private router: Router,
    private notificationsSrv: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.subscribeToFilterChange();
    this.subscribeToCurrentAppUserChange();
  }

  subscribeToFilterChange(): void {
    this._subscription.add(
      this.tasksFilters$
        .subscribe({
          next: (filterValue) => {
            const currentUserId = this.usersService.currentUser?.id;

            if (currentUserId) {
              this.assignedToCurrentUserTasks$.next(null);
              this.tasksCreatedByCurrentUser$.next(null);

              (filterValue === 'assignedToMe')
                ? this.loadTasksByUserId(currentUserId)
                : this.loadTasksCreatedByUserId(currentUserId);
            }
          },
        }),
    );
  }

  subscribeToCurrentAppUserChange(): void {
    this._subscription.add(
      this.usersService.currentUser$
        .pipe(
          map(user => {
            if (user?.id) {
              this.loadTasksByUserId(user.id);
              this.loadTasksCreatedByUserId(user.id);
            }
          }),
        )
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving current application user');
          },
        }),
    );
  }

  loadTasksByUserId(currentUserId: string): void {
    this._subscription.add(
      this.tasksService.loadTasksByUserId(currentUserId)
        .subscribe({
          next: tasks => {
            tasks = tasks.filter(task => task.status !== 'completed');
            if (tasks) this.assignedToCurrentUserTasks$.next(tasks);
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving assigned to user tasks list');
            this.assignedToCurrentUserTasks$.next([]);
          },
        }),
    );
  }

  loadTasksCreatedByUserId(currentUserId: string): void {
    this._subscription.add(
      this.tasksService.loadTasksCreatedByUserId(currentUserId)
        .subscribe({
          next: tasks => {
            tasks = tasks.filter(task => task.status !== 'completed');
            if (tasks) this.tasksCreatedByCurrentUser$.next(tasks);
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving tasks created by user');
            this.tasksCreatedByCurrentUser$.next([]);
          },
        }),
    );
  }

  openTaskPreviewModal(taskId: string): void {
    this.router.navigate([], { queryParams: {
      taskId, backTo: 'Dashboard', openFrom: 'dashboard',
    } });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
