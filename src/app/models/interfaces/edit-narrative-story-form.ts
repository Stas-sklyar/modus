import { FormControl } from '@angular/forms';

export interface NarrativeStoryEditForm {
  title: FormControl<string | null>,
  description: FormControl<string | null>,
}
