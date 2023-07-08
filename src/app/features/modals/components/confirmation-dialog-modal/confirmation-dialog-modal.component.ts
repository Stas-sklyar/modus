import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-confirmation-dialog-modal',
  templateUrl: './confirmation-dialog-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogModalComponent {
  @Input() title: string | null = 'Are you sure?';
  @Input() content: string | null = null;
  @Input() cancelButtonText: string | null = 'No';
  @Input() confirmButtonText: string | null = 'Yes';
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  constructor(
    private bsModalRef: BsModalRef,
  ) {}

  cancelAction(): void {
    this.cancel.emit();
    this.close();
  }

  confirmAction(): void {
    this.confirm.emit();
    this.close();
  }

  close(): void {
    this.closeDialog.emit();
    this.bsModalRef.hide();
  }
}
