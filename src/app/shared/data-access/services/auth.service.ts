import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, mergeMap, of, take, tap } from "rxjs";
import { environment } from "src/environments/environment";

const LOGGED_USER_STORAGE_KEY = "loggedUser";

// TODO create logged-user route and return a new UserLogged API Resource
export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public logIn(loginData: { email: string; password: string; remember: boolean }) {
    this.http
      .get(`${environment.apiUrl}/sanctum/csrf-cookie`)
      .pipe(
        take(1),
        mergeMap(() =>
          this.http.post(`${environment.apiUrl}/login`, loginData).pipe(take(1))
        ),
        mergeMap(() => this.fetchLoggedUser()),
        tap(() => this.router.navigate(["/"]))
      )
      .subscribe((user: User) => {
        this.setLoggedUserStorage(user);
      });
  }

  public fetchLoggedUser() {
    return this.http.get<{ data: User }>(`${environment.apiUrl}/api/user`).pipe(
      take(1),
      map((userData) => userData.data),
      tap((user) => {
        this.setLoggedUserStorage(user);
      })
    );
  }

  public getLoggedUserStorage(): User | null {
    const user = localStorage.getItem(LOGGED_USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  public setLoggedUserStorage(value: User | null) {
    if (value) {
      localStorage.setItem(LOGGED_USER_STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(LOGGED_USER_STORAGE_KEY);
    }
  }

  public logOut() {
    this.http
      .post(`${environment.apiUrl}/logout`, {})
      .pipe(take(1))
      .subscribe(() => {
        this.setLoggedUserStorage(null);
        this.router.navigateByUrl("/login");
      });
  }
}
