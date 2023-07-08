import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus/auto-focus.directive';

@Component({
  selector: 'lr-add-comment-form',
  templateUrl: './add-comment-form.component.html',
  styleUrls: ['./add-comment-form.component.scss'],
  imports: [CommonModule, FormsModule, AutoFocusDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AddCommentFormComponent {
  @Output() submitBtnWasPressed: EventEmitter<string> = new EventEmitter();

  comment: string = '';

  addNewComment(): void {
    this.submitBtnWasPressed.emit(this.comment);
    this.comment = '';
  }
}
