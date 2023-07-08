import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, switchMap, of } from 'rxjs';
import { ErrorsHandlerService } from '../../services/errors-handler/errors-handler.service';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../models/enums/app-routes';

@Injectable()
export class ResponseErrorsInterceptor implements HttpInterceptor {

  constructor(
    private errorsHandlerService: ErrorsHandlerService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const requiredAuthHeaders = this.loginService.requiredAuthHeaders(req.url);

          if (error.status === 401 && requiredAuthHeaders) {
            return this.loginService.refreshSessionToken()
              .pipe(
                switchMap((res) => {
                  const headers = req.headers.set('Authorization', `Bearer ${res.accessToken}`);
                  return next.handle(req.clone( { headers } ));
                }),
                catchError(err => {
                  this.loginService.accessToken = null;
                  this.loginService.refreshToken = null;
                  this.router.navigate(['/', AppRoutes.LOGIN]);
                  return of(err);
                }),
              );
          } else {
            this.errorsHandlerService.handleError(error);
            return throwError(error);
          }
        }),
      );
  }
}
