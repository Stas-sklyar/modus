import { NarrativeStoryItemType } from '../enums/narrative-story-item-type';

export interface NewStoryItem {
  parentStoryItemId: string | null | undefined,
  storyItemType: NarrativeStoryItemType
  title?: string | null | undefined,
  description?: string | null | undefined,
  order: number,
}
