import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { Observable, take, tap } from 'rxjs';
import { AuthTokenData } from '../../../models/interfaces';
import { LoginService } from '../login/login.service';
import { UserRole } from '../../../models/aliases/user-role';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(
    private backendApiService: BackendApiService,
    private loginService: LoginService,
  ) { }

  invitePerson(
    email: string,
    title: string | null,
    role: UserRole | null,
  ): Observable<any> {
    const reqBody = {
      email,
      ...(title && { title }),
      ...(role && {
        roles: [role],
      }),
    };

    return this.backendApiService.invite(reqBody);
  }

  registerAdmin(
    name: string,
    email: string,
    password: string,
    companyName: string,
  ): Observable<AuthTokenData> {
    const reqBody = {
      name,
      email,
      password,
      companyName,
    };
    return this.backendApiService.registerAdmin(reqBody)
      .pipe(
        tap(res => this.saveAccessParameters(res)),
        take(1),
      );
  }

  registerUser(
    name: string,
    password: string,
    token: string,
  ): Observable<AuthTokenData> {
    const reqBody = {
      name,
      password,
      token,
    };
    return this.backendApiService.register(reqBody)
      .pipe(
        tap(res => this.saveAccessParameters(res)),
        take(1),
      );
  }

  private saveAccessParameters(res: AuthTokenData): void {
    this.loginService.accessToken = res.accessToken;
    this.loginService.refreshToken = res.refreshToken;
  }
}
