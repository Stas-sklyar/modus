import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AppRoutes } from '../../../models/enums/app-routes';
import { LoginService } from '../../services/login/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    const hasAccess = this.loginService.accessToken;
    if (hasAccess) return true;

    return this.router.createUrlTree([AppRoutes.LOGIN]);
  }

}
