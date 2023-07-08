import { Pipe, PipeTransform } from '@angular/core';
import { TaskBoardColumn } from '../../../models/interfaces/task-board-column';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';

@Pipe({
  name: 'filterGroupedByStatusTasksBySearchQuery',
  standalone: true,
})
export class FilterGroupedByStatusTasksBySearchQueryPipe implements PipeTransform {

  transform(tasksGroupedByStatus: TaskBoardColumn[] | null, query: string = ''): TaskBoardColumn[] {
    if (tasksGroupedByStatus) {
      if (!query) return tasksGroupedByStatus;

      const tasksGroupedByStatusCopy = JSON.parse(JSON.stringify(tasksGroupedByStatus));

      for (const tasksGroupedByStatusItem of tasksGroupedByStatusCopy) {
        let filteredTasksArr = tasksGroupedByStatusItem.tasks.filter((task: TrialCaseTask) => {
          return task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
        });

        tasksGroupedByStatusItem.tasks = filteredTasksArr;
      }

      return tasksGroupedByStatusCopy;
    }

    return [];
  }

}
