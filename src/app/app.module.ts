import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core";
import { TUI_LANGUAGE, TUI_PORTUGUESE_LANGUAGE } from "@taiga-ui/i18n";
import { CookieModule } from "ngx-cookie";
import { of } from "rxjs";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { httpInterceptorProviders } from "./shared/data-access/interceptors";
import { AuthService } from "./shared/data-access/services/auth.service";
import { AppLayoutModule } from "./shared/feature/app-layout/app-layout.module";

function tryToGetUser(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.fetchLoggedUser().subscribe({
        next: (user) => {
          authService.setLoggedUser(user);
          resolve(user);
        },
        error: (err) => {
          resolve(err);
        },
      });
    });
  };
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    CookieModule.withOptions(),
    HttpClientModule,
    BrowserModule,
    AppLayoutModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    AppRoutingModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_PORTUGUESE_LANGUAGE),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: tryToGetUser,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
