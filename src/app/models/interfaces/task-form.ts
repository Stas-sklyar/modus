import { FormControl } from '@angular/forms';
import { TaskStatusEnum } from '../enums/task-status';

export interface TaskForm {
  title: FormControl<string | null>
  assignedToUserId: FormControl<string | null>
  status: FormControl<TaskStatusEnum | null>
  dueDate: FormControl<string | null>
  description: FormControl<string | null>
  trialCaseId: FormControl<string | null>
}
