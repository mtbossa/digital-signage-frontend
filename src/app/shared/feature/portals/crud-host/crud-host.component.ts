import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractTuiPortalHostComponent, AbstractTuiPortalService } from "@taiga-ui/cdk";

import { CrudPortalService } from "./crud-portal.service";

@Component({
  selector: `app-crud-host`,
  templateUrl: `./crud-host.component.html`,
  styleUrls: [`./crud-host.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AbstractTuiPortalService, useExisting: CrudPortalService }],
})
export class CrudHostComponent extends AbstractTuiPortalHostComponent {}
