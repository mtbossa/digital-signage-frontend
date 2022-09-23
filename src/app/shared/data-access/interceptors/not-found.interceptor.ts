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
export class NotFoundInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.NotFound) {
          this.router.navigateByUrl("/not-found");
        }

        return throwError(() => err);
      })
    );
  }
}
