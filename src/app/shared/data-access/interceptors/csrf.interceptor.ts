import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "src/app/shared/data-access/services/auth.service";

@Injectable()
export class CSRFInterceptor implements HttpInterceptor {
  constructor(private router: Router, private cookieService: CookieService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get("XSRF-TOKEN");

    if (token) {
      req = req.clone({
        setHeaders: { "X-XSRF-TOKEN": token },
      });
    }

    return next.handle(req.clone({ withCredentials: true }));
  }
}
