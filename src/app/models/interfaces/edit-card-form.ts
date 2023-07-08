import { FormControl } from '@angular/forms';

export interface EditCardForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
