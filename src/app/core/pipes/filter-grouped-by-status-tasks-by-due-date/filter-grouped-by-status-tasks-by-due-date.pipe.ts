import { Pipe, PipeTransform } from '@angular/core';
import { TaskBoardColumn } from '../../../models/interfaces/task-board-column';
import { UsersService } from '../../services/users/users.service';
import { TasksService } from '../../services/tasks/tasks.service';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';
import * as moment from 'moment';


@Pipe({
  name: 'filterGroupedByStatusTasksByDueDate',
  standalone: true,
})
export class FilterGroupedByStatusTasksByDueDatePipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
  ) {
  }

  transform(tasksGroupedByStatus: TaskBoardColumn[] | null, dueDateFilter: string | null): TaskBoardColumn[] {
    if (!dueDateFilter && tasksGroupedByStatus) {
      return tasksGroupedByStatus;
    }

    if (tasksGroupedByStatus && dueDateFilter) {
      const tasksGroupedByStatusCopy = JSON.parse(JSON.stringify(tasksGroupedByStatus));
      dueDateFilter = dueDateFilter?.toLowerCase().split(' ').join('-');

      for (const tasksGroupedByStatusItem of tasksGroupedByStatusCopy) {
        switch (dueDateFilter) {
          case 'overdue':
            tasksGroupedByStatusItem.tasks = tasksGroupedByStatusItem.tasks.filter((task: TrialCaseTask) => this.tasksService.taskIsOverdue(task.dueDate));
            break;

          case 'due-this-week':
            const startOfCurrentWeek = moment().startOf('week').add(1, 'd').set({ 'h': 0, 'm': 0, 's': 0 }).toISOString();
            const endOfCurrentWeek = moment().endOf('week').add(1, 'd').set({ 'h': 23, 'm': 59, 's': 59 }).toISOString();

            tasksGroupedByStatusItem.tasks = tasksGroupedByStatusItem.tasks.filter((task: TrialCaseTask) => task?.dueDate && task.dueDate > startOfCurrentWeek && task.dueDate < endOfCurrentWeek);
            break;

          case 'due-next-week':
            const startOfNextWeek = moment().startOf('week').add(2 + 6, 'd').set({ 'h': 0, 'm': 0, 's': 0 }).toISOString();
            const endOfNextWeek   = moment().endOf('week').add(1 + 7, 'd').set({ 'h': 23, 'm': 59, 's': 59 }).toISOString();

            tasksGroupedByStatusItem.tasks = tasksGroupedByStatusItem.tasks.filter((task: TrialCaseTask) => task?.dueDate && task.dueDate > startOfNextWeek && task.dueDate < endOfNextWeek);
            break;

          default:
            break;
        }
      }

      return tasksGroupedByStatusCopy;
    }

    return [];
  }

}
