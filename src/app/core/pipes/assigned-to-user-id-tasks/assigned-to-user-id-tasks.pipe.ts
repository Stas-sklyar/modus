import { Pipe, PipeTransform } from '@angular/core';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';
import { TaskBoardColumn } from '../../../models/interfaces/task-board-column';

@Pipe({
  name: 'assignedToUserIdTasks',
  standalone: true,
})
export class AssignedToUserIdTasksPipe implements PipeTransform {

  transform(tasks: TaskBoardColumn[] | null, userIdArr: string[] | null): TaskBoardColumn[] {
    if (!userIdArr && tasks) {
      return tasks;
    }

    if (userIdArr && tasks) {
      const tasksGroupedByStatus = JSON.parse(JSON.stringify(tasks));

      for (const userId of userIdArr) {
        for (const tasksGroupedByStatusItem of tasksGroupedByStatus) {
          let tasksForCurrentUser = tasksGroupedByStatus.tasks.filter((task: TrialCaseTask) => (userId === task.assignedToUserId));
          if (tasksForCurrentUser) tasksGroupedByStatusItem.tasks = tasksForCurrentUser;
        }
      }

      return tasksGroupedByStatus;
    }

    return [];
  }

}
