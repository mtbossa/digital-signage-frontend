import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../raspberry-list/raspberry-list.component").then(
        (m) => m.RaspberryListComponent
      ),
  },
  {
    path: "criar",
    loadComponent: () =>
      import("../raspberry-create-form/raspberry-create-form.component").then(
        (m) => m.RaspberryCreateFormComponent
      ),
  },
  {
    path: ":id/editar",
    loadComponent: () =>
      import("../raspberry-update-form/raspberry-update-form.component").then(
        (m) => m.RaspberryUpdateFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaspberryShellRoutingModule {}
