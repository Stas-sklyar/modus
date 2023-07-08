import { Component, OnDestroy } from '@angular/core';
import { TasksService } from '../../../../../core/services/tasks/tasks.service';
import { UsersService } from '../../../../../core/services/users/users.service';

@Component({
  selector: 'lr-tasks-filter-form',
  templateUrl: './tasks-filter-form.component.html',
  styleUrls: ['./tasks-filter-form.component.scss'],
})
export class TasksFilterFormComponent implements OnDestroy {

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {
  }

  filterTasksBySearchQuery(query: string): void {
    this.tasksService.searchQuery = query || null;
  }

  filterTasksByDueDate(dueDateFilter: string): void {
    this.tasksService.dueDateFilter = (dueDateFilter.length === 0) ? null : dueDateFilter[0];
  }

  filterTasksByAssignedToCurrentUserIdArr($event: Event): void {
    // TODO: REMOVE @ts-ignore
    // @ts-ignore
    if ($event.target.checked) {
      const currentUserId = this.usersService.currentUser?.id;

      this.tasksService.assignedToUserIdArr = currentUserId ? [currentUserId] : null;
    } else {
      this.tasksService.assignedToUserIdArr = null;
    }
  }

  ngOnDestroy(): void {
    this.tasksService.searchQuery = null;
    this.tasksService.dueDateFilter = null;
  }
}
