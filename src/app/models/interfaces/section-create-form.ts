import { FormControl } from '@angular/forms';

export interface SectionCreateForm {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
}
