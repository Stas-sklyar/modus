import { Pipe, PipeTransform } from '@angular/core';
import { TrialCaseTask } from '../../../models/interfaces/trial-case-task';

@Pipe({
  name: 'filterTasksBySearchQuery',
  standalone: true,
})
export class FilterTasksBySearchQueryPipe implements PipeTransform {

  transform(tasks: TrialCaseTask[] | null, query: string = ''): TrialCaseTask[] {
    if (tasks) {
      if (!query) return tasks;

      tasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
      });

      return tasks;
    }

    return [];
  }

}
