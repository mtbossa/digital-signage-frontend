import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core";
import { TUI_LANGUAGE, TUI_PORTUGUESE_LANGUAGE } from "@taiga-ui/i18n";
import { CookieModule } from "ngx-cookie";
import { of } from "rxjs";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { appHttpInterceptorProviders } from "./shared/data-access/interceptors";
import { AppLayoutModule } from "./shared/feature/app-layout/app-layout.module";

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
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_PORTUGUESE_LANGUAGE),
    },
    appHttpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
