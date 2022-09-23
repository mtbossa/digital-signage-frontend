import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../recurrence-list/recurrence-list.component").then(
        (m) => m.RecurrenceListComponent
      ),
  },
  {
    path: "criar",
    loadComponent: () =>
      import("../recurrence-create-form/recurrence-create-form.component").then(
        (m) => m.RecurrenceCreateFormComponent
      ),
  },
  {
    path: ":id/editar",
    loadComponent: () =>
      import("../recurrence-update-form/recurrence-update-form.component").then(
        (m) => m.RecurrenceUpdateFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecurrenceShellRoutingModule {}
