import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../../../core/services/login/login.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { PasswordResetForm } from '../../../../models/interfaces/password-reset-form';


@Component({
  selector: 'lr-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent implements OnDestroy {
  appRoutes = AppRoutes;
  passwordResetLinkReceived = false;
  form = new FormGroup<PasswordResetForm>({
    email: new FormControl(null),
  });
  private _subscription = new Subscription();
  submiting = new BehaviorSubject(false);

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getResetPasswordLink(): void {
    const { email } = this.form.value;

    if (email) {
      this.submiting.next(true);

      this._subscription.add(
        this.loginService.getResetPasswordLink(email)
          .subscribe({
            next: () => {
              this.passwordResetLinkReceived = true;
              this.cdr.detectChanges();
              this.submiting.next(false);
            },
            error: () => {
              this.submiting.next(false);
            },
          },
          ),
      );
    }
  }

}
