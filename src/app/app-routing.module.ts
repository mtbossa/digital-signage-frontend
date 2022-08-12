import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./shared/data-access/guards/auth.guard";
import { AppLayoutComponent } from "./shared/feature/app-layout/app-layout.component";
import { NotfoundComponent } from "./shared/ui/notfound/notfound.component";
import { LoginGuard } from "./user/feature/login/guards/login.guard";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./dashboard/feature/dashboard.module").then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: "login",
    canActivateChild: [LoginGuard],
    loadChildren: () =>
      import("./user/feature/login/login.module").then((m) => m.LoginModule),
  },
  { path: "notfound", component: NotfoundComponent },
  { path: "**", redirectTo: "notfound" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
