import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppHeaderComponent } from "../../ui/app-header/app-header.component";
import { AppSidebarComponent } from "../../ui/app-sidebar/app-sidebar.component";
import { AppSidebarNewComponent } from "../../ui/app-sidebar-new/app-sidebar-new.component";
import { AppLayoutComponent } from "./app-layout.component";

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppSidebarComponent,
    AppHeaderComponent,
    AppSidebarNewComponent,
  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
