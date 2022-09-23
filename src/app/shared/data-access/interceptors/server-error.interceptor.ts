import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TuiDialogService } from "@taiga-ui/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "src/app/shared/data-access/services/auth.service";

interface LaravelError {
  [key: string]: Array<string>;
}

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private router: Router
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({ withCredentials: true })).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.TooManyRequests) {
          this.router.navigateByUrl("/not-found");
          return throwError(() => err);
        }
        if (err.status !== HttpStatusCode.Unauthorized && err.status !== 419) {
          const errors = err.error.errors as LaravelError;

          const errorMessages = Object.entries(errors)
            .map(([errorField, errorMessage]) => `${errorField}: ${errorMessage}`)
            .join(" - ");

          const message = `Ocorreu um erro, tente novamente mais tarde. Error message: ${err.error.message}. Errors: ${errorMessages}`;
          this.dialogService
            .open(message, {
              label: `Erro!`,
              size: `l`,
              data: { button: `Fechar` },
            })
            .subscribe();
        }

        return throwError(() => err);
      })
    );
  }
}
