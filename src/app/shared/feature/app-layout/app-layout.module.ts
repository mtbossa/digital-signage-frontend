import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppSidebarModule } from "../../ui/app-sidebar/app-sidebar.module";

import { AppLayoutComponent } from "./app-layout.component";

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [CommonModule, RouterModule, AppSidebarModule],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
