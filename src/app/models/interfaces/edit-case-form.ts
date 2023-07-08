import { FormControl } from '@angular/forms';

export interface EditCaseForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
