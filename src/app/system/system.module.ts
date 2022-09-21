import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core";

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
})
export class SystemModule {}
