import { FormControl } from '@angular/forms';

export interface CardTaskCreateForm {
  title: FormControl<string | null>,
  description: FormControl<string | null>,
  assignedToUserId: FormControl<string | null>,
  dueDate: FormControl<Date | null>
}
