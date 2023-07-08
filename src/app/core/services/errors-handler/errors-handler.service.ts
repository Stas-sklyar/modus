import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorsHandlerService {

  constructor(
    private notificationsService: NotificationsService,
  ) { }

  handleError(err: HttpErrorResponse): void {
    this.notificationsService.notifyError('Something went wrong, please, try again later');
    console.log('Err service: ', err);
  }
}
