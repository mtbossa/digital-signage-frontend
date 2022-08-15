import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppSidebarComponent } from "../../ui/app-sidebar/app-sidebar.component";
import { AppLayoutComponent } from "./app-layout.component";

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [CommonModule, RouterModule, AppSidebarComponent],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
