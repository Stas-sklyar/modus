import { FormControl } from '@angular/forms';
import { NarrativeStoryItemType } from '../enums/narrative-story-item-type';

export interface CreateStoryItemForm {
  parentStoryItemId: FormControl<string | null>,
  storyItemType: FormControl<NarrativeStoryItemType | null>,
  title: FormControl<string | null>,
  description: FormControl<string | null>,
}
