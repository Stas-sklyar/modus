import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponseErrorsInterceptor } from './interceptors/response-errors/response-errors.interceptor';
import { LoginInterceptor } from './interceptors/login/login.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { ToastComponent } from './components/toastr/toast.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ModalModule.forRoot(),
    NgbOffcanvasModule,
    QuillModule.forRoot(),
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseErrorsInterceptor, multi: true },
  ],
  declarations: [
    ToastComponent,
  ],
})
export class CoreModule {}
