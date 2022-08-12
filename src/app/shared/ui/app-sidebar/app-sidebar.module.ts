import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiSidebarModule } from "@taiga-ui/addon-mobile";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { TuiAccordionModule } from "@taiga-ui/kit";

import { AppSidebarComponent } from "./app-sidebar.component";

@NgModule({
  declarations: [AppSidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    TuiAccordionModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
  ],
  exports: [AppSidebarComponent],
})
export class AppSidebarModule {}
