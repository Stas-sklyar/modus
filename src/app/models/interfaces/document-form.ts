import { FormControl } from '@angular/forms';

export interface DocumentForm {
  folderId: FormControl<string | null>,
  fileName: FormControl<string | null>
  title: FormControl<string | null>,
  batesNumber: FormControl<string | null>,
  description: FormControl<string | null>,
}
