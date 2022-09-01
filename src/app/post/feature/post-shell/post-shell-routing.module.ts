import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../post-list/post-list.component").then((m) => m.PostListComponent),
  },
  {
    path: "criar",
    loadComponent: () =>
      import("../post-create-form/post-create-form.component").then(
        (m) => m.PostCreateFormComponent
      ),
  },
  {
    path: ":id/editar",
    loadComponent: () =>
      import("../post-update-form/post-update-form.component").then(
        (m) => m.PostUpdateFormComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostShellRoutingModule {}
