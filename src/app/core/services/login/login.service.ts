import { Injectable } from '@angular/core';
import {
  Observable,
  tap,
  timer,
  switchMap, take,
} from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { AuthTokenData } from '../../../models/interfaces';
import { BrowserStorageKeys } from '../../../models/enums/browser-storage-keys';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  get accessToken(): string | null {
    return sessionStorage.getItem(BrowserStorageKeys.ACCESS_TOKEN);
  }
  set accessToken(token: string | null) {
    if (token) {
      sessionStorage.setItem(BrowserStorageKeys.ACCESS_TOKEN, token);
    } else {
      sessionStorage.removeItem(BrowserStorageKeys.ACCESS_TOKEN);
    }
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(BrowserStorageKeys.REFRESH_TOKEN);
  }
  set refreshToken(token: string | null) {
    if (token) {
      sessionStorage.setItem(BrowserStorageKeys.REFRESH_TOKEN, token);
    } else {
      sessionStorage.removeItem(BrowserStorageKeys.REFRESH_TOKEN);
    }
  }

  constructor(
    private backendApiService: BackendApiService,
  ) { }

  login(
    email: string,
    password: string,
  ): Observable<AuthTokenData> {
    const reqBody = {
      email,
      password,
    };
    return this.backendApiService.login(reqBody)
      .pipe(
        tap(res => {
          this.accessToken = res.accessToken;
          this.refreshToken = res.refreshToken;
        }),
        take(1),
      );
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  keepUserSessionActive(): Observable<AuthTokenData> {
    const REQUEST_INTERVAL = 300000;

    return timer(REQUEST_INTERVAL, REQUEST_INTERVAL)
      .pipe(
        switchMap(() => this.refreshSessionToken()),
      );
  }

  refreshSessionToken(): Observable<AuthTokenData> {
    const reqBody = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
    return this.backendApiService.refreshToken(reqBody).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.refreshToken = res.refreshToken;
      }),
      take(1),
    );
  }

  getResetPasswordLink(email: string): Observable<any> {
    const reqBody = {
      email,
    };
    return this.backendApiService.getResetPasswordLink(reqBody)
      .pipe(
        take(1),
      );
  }

  applyNewPassword(password: string, id: string, token: string): Observable<any> {
    const reqBody = {
      password,
      id,
      token,
    };
    return this.backendApiService.updatePassword(reqBody);
  }

  requiredAuthHeaders(reqUrl: string): boolean {
    const authApiPaths = ['api/auth/login', 'api/auth/refreshToken', 'api/auth/register'];
    return !authApiPaths.some(path => reqUrl.includes(path));
  }

}
