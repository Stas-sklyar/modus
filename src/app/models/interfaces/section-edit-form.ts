import { FormControl } from '@angular/forms';

export interface SectionEditForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
