import { TestBed } from '@angular/core/testing';

import { ResponseErrorsInterceptor } from './response-errors.interceptor';

describe('ResErrInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ResponseErrorsInterceptor,
    ],
  }));

  it('should be created', () => {
    const interceptor: ResponseErrorsInterceptor = TestBed.inject(ResponseErrorsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
