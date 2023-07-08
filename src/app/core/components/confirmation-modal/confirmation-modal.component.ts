import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'lr-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ConfirmationModalComponent {
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();

  onClickCancelBtn(): void {
    this.cancel.emit();
  }

  onClickConfirmBtn(): void {
    this.confirm.emit();
  }
}
