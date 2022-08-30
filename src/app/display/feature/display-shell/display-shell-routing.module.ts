import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../display-list/display-list.component").then(
        (m) => m.DisplayListComponent
      ),
  },
  {
    path: "criar",
    loadComponent: () =>
      import("../display-create-form/display-create-form.component").then(
        (m) => m.DisplayCreateFormComponent
      ),
  },
  {
    path: ":id/editar",
    loadComponent: () =>
      import("../display-update-form/display-update-form.component").then(
        (m) => m.DisplayUpdateFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayShellRoutingModule {}
