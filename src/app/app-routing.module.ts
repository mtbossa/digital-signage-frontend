import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { InvitationResolver } from "./invitation/feature/invitation-accept-form/resolver/invitation.resolver";
import { AuthGuard } from "./shared/data-access/guards/auth.guard";
import { NotfoundComponent } from "./shared/ui/notfound/notfound.component";
import { LoginGuard } from "./user/feature/login/guards/login.guard";

const routes: Routes = [
  {
    path: "convites/:invitationToken/aceitar",
    canActivateChild: [LoginGuard],
    resolve: {
      invitation: InvitationResolver,
    },
    loadChildren: () =>
      import(
        "./invitation/feature/invitation-accept-form/invitation-accept-form-routing.module"
      ).then((m) => m.InvitationAcceptRoutingModule),
  },
  {
    path: "login",
    canActivateChild: [LoginGuard],
    loadChildren: () =>
      import("./user/feature/login/login.module").then((m) => m.LoginModule),
  },
  { path: "notfound", component: NotfoundComponent },
  // Order of routes matters, more specific routes should be placed above less specific routes
  // Reference: https://stackoverflow.com/questions/60180633/why-is-canload-function-resulting-in-infinite-loop-during-reroute
  {
    path: "",
    canLoad: [AuthGuard],
    loadChildren: () => import("./system/system.module").then((m) => m.SystemModule),
  },
  { path: "**", redirectTo: "notfound" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
