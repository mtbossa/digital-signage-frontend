import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptor } from "./auth.interceptor";
import { CSRFInterceptor } from "./csrf.interceptor";
import { NotFoundInterceptor } from "./not-found.interceptor";

/** Http interceptor providers in outside-in order */
export const appHttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CSRFInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: NotFoundInterceptor, multi: true },
];
