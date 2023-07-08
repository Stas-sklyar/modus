import { Component, EventEmitter, Output } from '@angular/core';
import { NarrativeStoryItemType } from '../../../../models/enums/narrative-story-item-type';

@Component({
  selector: 'lr-add-story-item-btn',
  templateUrl: './add-story-item-btn.component.html',
  styleUrls: ['./add-story-item-btn.component.scss'],
})
export class AddStoryItemBtnComponent {
  @Output() addStoryItemEvent: EventEmitter<NarrativeStoryItemType> = new EventEmitter();

  addStoryItem(storyItemType: string): void {
    if (storyItemType === 'allegation') {
      this.addStoryItemEvent.emit(NarrativeStoryItemType.ALLEGATION);
    }

    if (storyItemType === 'note') {
      this.addStoryItemEvent.emit(NarrativeStoryItemType.NOTE);
    }

    if (storyItemType === 'fact') {
      this.addStoryItemEvent.emit(NarrativeStoryItemType.FACT);
    }
  }
}
