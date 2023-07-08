import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requiredAuthHeaders = this.loginService.requiredAuthHeaders(req.url);
    const accessToken = this.loginService.accessToken;

    const headers = requiredAuthHeaders ?
      req.headers.set('Authorization', `Bearer ${ accessToken }`) :
      req.headers.delete('Authorization');

    return next.handle(req.clone( { headers } ));
  }
}
