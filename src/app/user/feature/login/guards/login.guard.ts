import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { catchError, map, Observable, of, tap } from "rxjs";
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
    const loggedUser = this.authService.getLoggedUserStorage();

    if (loggedUser) {
      return this.router.createUrlTree([""]);
    } else {
      return true;
    }

    // return this.authService.fetchLoggedUser().pipe(
    //   tap((user) => this.authService.setLoggedUser(user)),
    //   map((user) => this.router.createUrlTree(["/"])),
    //   catchError((err) => {
    //     return of(err).pipe(map(() => true));
    //   })
    // );
  }
}
