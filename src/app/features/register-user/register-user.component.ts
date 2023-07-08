import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize, Subscription, switchMap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../../core/services/registration/registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '../../models/enums/app-routes';
import { MainRoutes } from '../../models/enums/main-routes';
import { RegisterUserForm } from '../../models/interfaces/register-user-form';

@Component({
  selector: 'lr-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterUserComponent implements OnDestroy {
  controlToken = this.route.snapshot.queryParamMap.get('token');
  form = new FormGroup<RegisterUserForm>({
    name: new FormControl('', Validators.required),
    password: new FormControl(null, Validators.required),
  });
  private _subscription = new Subscription();
  sending = new BehaviorSubject(false);

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  initRegistrationProcess(): void {
    const { name, password } = this.form.value;
    if (name && password && this.controlToken) {
      this.sending.next(true);

      this._subscription.add(
        this.registrationService.registerUser(name, password, this.controlToken)
          .pipe(
            switchMap(() => this.router.navigate([AppRoutes.MAIN, MainRoutes.DASHBOARD])),
            finalize(() => this.sending.next(false)),
          )
          .subscribe({
            error: () => this.sending.next(false),
          }),
      );
    }
  }

}
