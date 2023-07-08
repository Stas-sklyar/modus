import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {

  constructor(
    private bsModalRef: BsModalRef,
  ) { }

  closeModal(): void {
    this.bsModalRef.hide();
  }
}
