import { FormControl } from '@angular/forms';

export interface EditNoteForm {
  title: FormControl<string | null>,
  description: FormControl<string | null>,
}
