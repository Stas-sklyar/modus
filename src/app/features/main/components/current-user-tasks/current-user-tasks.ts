import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CurrentUserTasksFilterFormComponent } from './current-user-tasks-filter-form/current-user-tasks-filter-form.component';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { UsersService } from '../../../../core/services/users/users.service';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago/time-ago.pipe';
import { Router } from '@angular/router';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import {
  FilterTasksBySearchQueryPipe,
} from '../../../../core/pipes/filter-tasks-by-search-query.ts/filter-tasks-by-search-query.pipe';
import { FilterTasksByDueDatePipe } from '../../../../core/pipes/filter-tasks-by-due-date/filter-tasks-by-due-date.pipe';
import { SortableHeaderDirective } from '../../../../core/directives/sortable-header/sortable-header.directive';
import { TableSortEvent } from '../../../../models/interfaces/table-sort-event';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import {
  AssignedToUserIdTasksPipe,
} from '../../../../core/pipes/assigned-to-user-id-tasks/assigned-to-user-id-tasks.pipe';

@Component({
  selector: 'lr-current-user-tasks',
  templateUrl: './current-user-tasks.html',
  styleUrls: ['./current-user-tasks.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrentUserTasksFilterFormComponent, NgIf, AsyncPipe, DatePipe, NgForOf, TimeAgoPipe, FilterTasksBySearchQueryPipe, FilterTasksByDueDatePipe, SortableHeaderDirective, AssignedToUserIdTasksPipe],
})
export class CurrentUserTasks implements OnInit, OnDestroy {
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  tasks$ = this.tasksService.currentUserTasks$;
  searchQuery$ = new BehaviorSubject('');
  dueDateFilter$ = new BehaviorSubject<string | null>(null);
  tasksSorter$ = new BehaviorSubject<TableSortEvent | null>(null);
  private _subscription = new Subscription();
  constructor(
    public tasksService: TasksService,
    private usersService: UsersService,
    private notificationsSrv: NotificationsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscribeToTasksFilters();
    this.subscribeToCurrentAppUserChange();
  }

  subscribeToTasksFilters(): void {
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
  }

  subscribeToCurrentAppUserChange(): void {
    this._subscription.add(
      this.usersService.currentUser$
        .pipe(
          map(user => {
            if (user?.id) {
              this.loadTasksByUserId(user.id);
            } else {
              this._subscription.add(
                this.usersService.getCurrentAppUser().subscribe(),
              );
            }
          }),
        )
        .subscribe(),
    );
  }

  loadTasksByUserId(currentUserId: string): void {
    this._subscription.add(
      this.tasksService.loadTasksByUserId(currentUserId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving tasks list');
          },
        }),
    );
  }

  openTaskPreviewModal(taskId: string): void {
    this.router.navigate([], { queryParams: {
      taskId, backTo: 'My tasks', openFrom: 'dashboard',
    } });
  }

  onSort(sortEvent: TableSortEvent): void {
    this.resetSortableHeaders(sortEvent);
    this.tasksSorter$.next(sortEvent);
  }

  private resetSortableHeaders(sortEvent: TableSortEvent): void {
    this.headers.forEach((header) => {
      if (header.column !== sortEvent.column) {
        header.direction = '';
      }
    });
  }

  applySorting(
    tasks: TrialCaseTask[],
    sorter: TableSortEvent | null,
  ): TrialCaseTask[] {

    if (!sorter || (sorter.column === '') || (sorter.direction === '')) {
      return tasks || [];
    }

    const newTasks = [...tasks];

    return newTasks.sort((a, b) => {
      let compareIndex;
      switch (sorter.column) {
        case 'taskName':
          compareIndex = this.compareAlphabetically(a.title, b.title);
          break;
        case 'caseName':
          compareIndex = this.compareAlphabetically(a.trialCase.name, b.trialCase.name);
          break;
        case 'dueDate':
          compareIndex = this.compareDate(a?.dueDate || null, b?.dueDate || null);
          break;
        default:
          compareIndex = this.compareDate(a?.dueDate || null, b?.dueDate || null);
      }
      return sorter.direction === 'asc' ? compareIndex : -compareIndex;
    });
  }

  private compareAlphabetically(value1: string, value2: string): number {
    const v1 = value1.toLowerCase();
    const v2 = value2.toLowerCase();
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private compareDate(value1: string | null, value2: string | null): number {
    if (!value1 || !value2) return -1;

    const v1 = new Date(value1);
    const v2 = new Date(value2);
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
