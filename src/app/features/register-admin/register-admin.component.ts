import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize, Subscription, switchMap, take } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RegisterAdminForm } from '../../models/interfaces/register-admin-form';
import { RegistrationService } from '../../core/services/registration/registration.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../models/enums/app-routes';
import { MainRoutes } from '../../models/enums/main-routes';

@Component({
  selector: 'lr-register-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAdminComponent implements OnDestroy {
  form = new FormGroup<RegisterAdminForm>({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, this.emailValidator()),
    password: new FormControl(null, this.passwordValidator()),
    companyName: new FormControl(null, Validators.required),
  });
  submitting = new BehaviorSubject(false);
  get invalidEmailError(): boolean {
    return this.form.controls.email.dirty && this.form.controls.email.hasError('invalidEmail');
  }
  get invalidPasswordError(): boolean {
    return this.form.controls.password.dirty && this.form.controls.password.hasError('invalidPassword');
  }
  private _subscription = new Subscription();

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  initRegistrationProcess(): void {
    const { name, email, password, companyName } = this.form.value;

    if (name && email && password && companyName) {
      this.submitting.next(true);

      this._subscription.add(
        this.registrationService.registerAdmin(name, email, password, companyName)
          .pipe(
            take(1),
            finalize(() => {
              this.submitting.next(false);
            }),
            switchMap(() => this.router.navigate([AppRoutes.MAIN, MainRoutes.DASHBOARD])),
          )
          .subscribe({
            next: () => this.form.reset(),
            error: () => this.submitting.next(false),
          }),
      );
    }
  }

  private emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(email);
      return valid ? null : { invalidEmail: true };
    };

  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const minLength = 8;

      const valid = hasUppercase && hasLowercase && hasNumber && password.length >= minLength;
      return valid ? null : { invalidPassword: true };
    };
  }

}
