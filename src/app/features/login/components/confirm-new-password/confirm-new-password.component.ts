import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../../../core/services/login/login.service';
import { ConfirmNewPasswordForm } from '../../../../models/interfaces/confirm-new-password-form';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '../../../../models/enums/app-routes';

@Component({
  selector: 'lr-confirm-new-password',
  templateUrl: './confirm-new-password.component.html',
  styleUrls: ['./confirm-new-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNewPasswordComponent implements OnDestroy {
  appRoutes = AppRoutes;
  errorOccurred = new BehaviorSubject(false);
  passwordsAreNotMatch: boolean = false;
  passwordIsInvalid: boolean = false;
  userId = this.route.snapshot.queryParamMap.get('id');
  controlToken = this.route.snapshot.queryParamMap.get('token');
  form = new FormGroup<ConfirmNewPasswordForm>({
    newPassword: new FormControl(null),
    confirmPassword: new FormControl(null),
  });
  private _subscription = new Subscription();
  submiting = new BehaviorSubject(false);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  applyNewPassword(): void {
    const { newPassword, confirmPassword } = this.form.value;

    this.resetValidationErrors();

    if (newPassword && confirmPassword && this.userId && this.controlToken) {
      const passwordsAreValid = this.validateForm(newPassword, confirmPassword);

      if (passwordsAreValid) {
        this.submiting.next(true);

        this._subscription.add(
          this.loginService.applyNewPassword(newPassword, this.userId, this.controlToken)
            .pipe(
              switchMap(() => this.router.navigate([AppRoutes.LOGIN])),
            )
            .subscribe({
              next: () => {
                this.submiting.next(false);
              },
              error: () => {
                this.errorOccurred.next(true);
                this.submiting.next(false);
              },
            }),
        );
      }
    }
  }

  validateForm(newPassword: string, confirmPassword: string): boolean {
    if (newPassword !== confirmPassword) {
      this.passwordsAreNotMatch = true;
      return false;
    }

    const passwordLengthMeetsRequirement = newPassword.length >= 6;
    const passwordContainDigit = /[0-9]/.test(newPassword);
    const passwordContainNonAlphanumericCharacter = /^(?=.*[^a-zA-Z0-9]).*$/.test(newPassword);
    const passwordContainUppercase = newPassword.split('').filter(symbol => symbol.toUpperCase() === symbol).length > 0;

    if (!passwordLengthMeetsRequirement || !passwordContainDigit || !passwordContainUppercase || !passwordContainNonAlphanumericCharacter) {
      this.passwordIsInvalid = true;
      return false;
    }

    return true;
  }

  resetValidationErrors(): void {
    this.passwordsAreNotMatch = false;
    this.passwordIsInvalid = false;
  }

}
