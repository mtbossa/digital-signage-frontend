import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../media-list/media-list.component").then((m) => m.MediaListComponent),
  },
  {
    path: "criar",
    loadComponent: () =>
      import("../media-create-form/media-create-form.component").then(
        (m) => m.MediaCreateFormComponent
      ),
  },
  {
    path: ":id/editar",
    loadComponent: () =>
      import("../media-update-form/media-update-form.component").then(
        (m) => m.MediaUpdateFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaShellRoutingModule {}
