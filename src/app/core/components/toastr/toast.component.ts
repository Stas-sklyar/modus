import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'lr-toastr',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {
  message = this.notificationsService.message;

  constructor(
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.closeToastr();
    }, 1800);
  }

  closeToastr(): void {
    this.notificationsService.closeLastNotify();
  }
}
