import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../media-list/media-list.component").then((m) => m.MediaListComponent),
  },
  {
    path: "create",
    loadComponent: () =>
      import("../media-form/media-form.component").then((m) => m.MediaFormComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaShellRoutingModule {}
