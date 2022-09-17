import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core";
import { TUI_LANGUAGE, TUI_PORTUGUESE_LANGUAGE } from "@taiga-ui/i18n";
import { CookieModule } from "ngx-cookie";
import { of } from "rxjs";

import { httpInterceptorProviders } from "../shared/data-access/interceptors";
import { AuthService } from "../shared/data-access/services/auth.service";
import { AppLayoutModule } from "../shared/feature/app-layout/app-layout.module";
import { SystemRoutingModule } from "./system-routing.module";

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    AppLayoutModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    SystemRoutingModule,
  ],
  providers: [httpInterceptorProviders],
})
export class SystemModule {}
