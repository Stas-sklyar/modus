import { Pipe, PipeTransform } from '@angular/core';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';
import { UsersService } from '../../services/users/users.service';
import { TasksService } from '../../services/tasks/tasks.service';
import * as moment from 'moment';

@Pipe({
  name: 'filterTasksByDueDate',
  standalone: true,
})
export class FilterTasksByDueDatePipe implements PipeTransform {

  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
  ) {
  }
  transform(tasks: TrialCaseTask[] | null, typeFilter: string | null): TrialCaseTask[] {
    if (!typeFilter) {
      return tasks || [];
    }

    if (tasks) {
      typeFilter = typeFilter?.toLowerCase().split(' ').join('-');
      let filteredTasks: TrialCaseTask[];

      switch (typeFilter) {
        case 'overdue':
          filteredTasks = tasks.filter(task => this.tasksService.taskIsOverdue(task.dueDate));
          break;

        case 'due-this-week':
          const startOfCurrentWeek = moment().startOf('week').add(1, 'd').set({ 'h': 0, 'm': 0, 's': 0 }).toISOString();
          const endOfCurrentWeek = moment().endOf('week').add(1, 'd').set({ 'h': 23, 'm': 59, 's': 59 }).toISOString();

          filteredTasks = tasks.filter(task => (task?.dueDate && (task.dueDate > startOfCurrentWeek && task.dueDate < endOfCurrentWeek)));
          break;

        case 'due-next-week':
          const startOfNextWeek = moment().startOf('week').add(1 + 7, 'd').set({ 'h': 0, 'm': 0, 's': 0 }).toISOString();
          const endOfNextWeek   = moment().endOf('week').add(1 + 7, 'd').set({ 'h': 23, 'm': 59, 's': 59 }).toISOString();

          filteredTasks = tasks.filter(task => task?.dueDate && task.dueDate > startOfNextWeek && task.dueDate < endOfNextWeek);
          break;

        default:
          filteredTasks = tasks;
          break;
      }

      return filteredTasks;
    }

    return [];
  }

}
