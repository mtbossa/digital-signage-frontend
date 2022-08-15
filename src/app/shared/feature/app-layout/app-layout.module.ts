import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppHeaderComponent } from "../../ui/app-header/app-header.component";
import { AppSidebarComponent } from "../../ui/app-sidebar/app-sidebar.component";
import { AppLayoutComponent } from "./app-layout.component";

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [CommonModule, RouterModule, AppSidebarComponent, AppHeaderComponent],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
