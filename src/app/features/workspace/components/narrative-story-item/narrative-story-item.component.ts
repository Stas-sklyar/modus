import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TrialCaseNarrativeStoryItem } from '../../../../models/interfaces/trial-case-narrative-story-item';

@Component({
  selector: 'lr-narrative-story-item',
  templateUrl: './narrative-story-item.component.html',
  styleUrls: ['./narrative-story-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarrativeStoryItemComponent {
  @Input() storyItem!: TrialCaseNarrativeStoryItem;
  @Input() isOpen: boolean = false;
  @Input() parentStoryItemIndex!: number;
  @Output() toggleChildStoryItem = new EventEmitter();
  @Output() toggleParentStoryItem = new EventEmitter();
  onExpanderClick(): void {
    if (this.parentStoryItemIndex === undefined) {
      this.toggleParentStoryItem.emit();
    } else {
      this.toggleChildStoryItem.emit();
    }
  }
}
