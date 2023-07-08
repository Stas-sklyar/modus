import { FormControl } from '@angular/forms';

export interface ExhibitForm {
  parentDocument: FormControl<string | null>,
  fileName: FormControl<string | null>
  title: FormControl<string | null>,
  exhibitStamp: FormControl<string | null>,
  description: FormControl<string | null>,
}
