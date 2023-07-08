import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';

const FILTER_SLICE_SIZE = 2;

@Component({
  selector: 'lr-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskInfoComponent {
  @Input() task!: TrialCaseTask;
  @Output() changeCategory = new EventEmitter();

  commentsSliceSizeFilter: number | undefined = FILTER_SLICE_SIZE;
  showAllComments = false;

  toggleCommentsList(): void {
    this.showAllComments = !this.showAllComments;
    this.commentsSliceSizeFilter = this.commentsSliceSizeFilter ? undefined : FILTER_SLICE_SIZE;
  }
}
