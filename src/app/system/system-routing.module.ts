import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppLayoutComponent } from "../shared/feature/app-layout/app-layout.component";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../dashboard/feature/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "midias",
        loadChildren: () =>
          import("../media/feature/media-shell/media-shell.module").then(
            (m) => m.MediaShellModule
          ),
      },
      {
        path: "displays",
        loadChildren: () =>
          import("../display/feature/display-shell/display-shell.module").then(
            (m) => m.DisplayShellModule
          ),
      },
      {
        path: "posts",
        loadChildren: () =>
          import("../post/feature/post-shell/post-shell.module").then(
            (m) => m.PostShellModule
          ),
      },
      {
        path: "convites",
        loadChildren: () =>
          import("../invitation/feature/invitation-shell/invitation-shell.module").then(
            (m) => m.InvitationShellModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
