import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, tap } from "rxjs";
import { AuthService } from "src/app/shared/data-access/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.getLoggedUser().pipe(
      map((user) => (user ? false : true)),
      tap((canActivate) => {
        if (!canActivate) {
          this.router.navigateByUrl("/");
        }
      })
    );
  }
}
