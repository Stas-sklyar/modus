import { NarrativeStoryItemType } from '../enums/narrative-story-item-type';

export interface EditingStoryItem {
  id: string;
  storyItemType: NarrativeStoryItemType;
  title: string;
  parentStoryItemId: string | null;
  description: string | null;
}
