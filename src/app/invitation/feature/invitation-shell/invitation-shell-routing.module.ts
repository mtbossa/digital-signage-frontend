import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../invitation-list/invitation-list.component").then(
        (m) => m.InvitationListComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationShellRoutingModule {}
