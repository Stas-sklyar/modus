import { FormControl } from '@angular/forms';
import { NarrativeStoryItemType } from '../enums/narrative-story-item-type';

export interface EditStoryItemForm {
  storyItemType: FormControl<NarrativeStoryItemType | null>,
  title: FormControl<string | null>,
  parentStoryItemId: FormControl<string | null>,
  description: FormControl<string | null>,
}
