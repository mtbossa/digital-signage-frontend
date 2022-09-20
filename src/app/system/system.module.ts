import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core";

import { AuthService } from "../shared/data-access/services/auth.service";
import { AppLayoutModule } from "../shared/feature/app-layout/app-layout.module";
import { SystemRoutingModule } from "./system-routing.module";

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
  declarations: [],
  imports: [
    HttpClientModule,
    AppLayoutModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    SystemRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: tryToGetUser,
      deps: [AuthService],
      multi: true,
    },
  ],
})
export class SystemModule {}
