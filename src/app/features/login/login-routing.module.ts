import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutes } from '../../models/enums/login-routes';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ConfirmNewPasswordComponent } from './components/confirm-new-password/confirm-new-password.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

const routes: Routes = [
  {
    path: LoginRoutes.ENTRY,
    component: LoginPageComponent,
  },
  {
    path: LoginRoutes.PASSWORD_RESET,
    component: PasswordResetComponent,
  },
  {
    path: LoginRoutes.PASSWORD_RESET_LINK,
    component: ConfirmNewPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule { }
