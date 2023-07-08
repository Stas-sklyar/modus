import { FormControl } from '@angular/forms';

export interface CardCreateForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
