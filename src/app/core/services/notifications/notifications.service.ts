import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToastComponent } from '../../components/toastr/toast.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private _message = '';
  private _toastIdArr: number[] = [];
  get message(): string {
    return this._message;
  }

  set message(message: string) {
    this._message = message;
  }
  constructor(
    private toastrService: ToastrService,
  ) { }

  notifySuccess(message: string): void {
    this.message = message;

    this._toastIdArr.push(
      this.toastrService.success(
        message,
        undefined,
        {
          toastComponent: ToastComponent,
        },
      ).toastId);
  }

  notifyWarning(message: string): void {
    this.toastrService.warning(message);
  }

  notifyError(message: string): void {
    this.toastrService.error(message);
  }

  closeLastNotify(): void {
    this.toastrService.remove(this._toastIdArr[0]);
    this._toastIdArr.shift();
  }
}
