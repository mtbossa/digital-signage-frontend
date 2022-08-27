import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CrudHostComponent } from "./crud-host.component";

@NgModule({
  imports: [CommonModule],
  declarations: [CrudHostComponent],
  exports: [CrudHostComponent],
})
export class CrudHostModule {}
