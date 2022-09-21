import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { CSRFInterceptor } from "./csrf.interceptor";
import { NotFoundInterceptor } from "./not-found.interceptor";
import { ServerErrorInterceptor } from "./server-error.interceptor";
import { UnauthorizedInterceptor } from "./unauthorized.interceptor";

/** Http interceptor providers in outside-in order */
export const appHttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CSRFInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: NotFoundInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
];
