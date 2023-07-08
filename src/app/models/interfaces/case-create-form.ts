import { FormControl } from '@angular/forms';

export interface CaseCreateForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
