import { FormControl } from '@angular/forms';

export interface CreateNoteForm {
  title: FormControl<string | null>,
  description: FormControl<string | null>,
}
