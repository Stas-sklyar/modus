import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../../../../models/interfaces';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { LoginRoutes } from '../../../../models/enums/login-routes';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginService } from '../../../../core/services/login/login.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnDestroy {
  loginRoutes = LoginRoutes;
  appRoutes = AppRoutes;
  private _subscription = new Subscription();
  sending = new BehaviorSubject(false);
  constructor(
    public loginService: LoginService,
    private router: Router,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  form = new FormGroup<LoginForm>({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  initLoginProcess(): void {
    const { email, password } = this.form.value;
    if (email && password) {
      this.sending.next(true);

      this._subscription.add(
        this.loginService.login(email, password)
          .subscribe(
            {
              next: res => {
                this.sending.next(false);
                if (res.accessToken) {
                  this.initTokenRefreshingProcess();
                  this.router.navigate([AppRoutes.MAIN]);
                }
              },
              error: () => {
                this.sending.next(false);
                this.notificationsService.notifyError('An error occurred when login, please try again');
              },
            },
          ),
      );
    }
  }

  initTokenRefreshingProcess(): void {
    this.loginService.keepUserSessionActive().subscribe();
  }
}
