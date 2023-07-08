import { FormControl } from '@angular/forms';

export interface NarrativeStoryCreateForm {
  title: FormControl<string | null>,
  description: FormControl<string | null>,
}
