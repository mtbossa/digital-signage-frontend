import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { TuiLetModule } from "@taiga-ui/cdk";
import { TuiAlertService, TuiButtonModule, TuiLoaderModule } from "@taiga-ui/core";
import {
  AppSearchableTableComponent,
  Column,
} from "src/app/shared/feature/app-searchable-table/app-searchable-table/app-searchable-table.component";

import { RaspberriesService } from "../../data-access/raspberry.service";

@Component({
  selector: "app-raspberry-list",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    AppSearchableTableComponent,
  ],
  templateUrl: "./raspberry-list.component.html",
  styleUrls: ["./raspberry-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaspberryListComponent {
  columns: Column[] = [
    {
      key: "id",
      title: "ID",
    },
    {
      key: "short_name",
      title: "Nome",
    },
    {
      key: "mac_address",
      title: "Endereço MAC",
    },
    {
      key: "serial_number",
      title: "Número Serial",
    },
    {
      key: "display_id",
      title: "Ligado no Display",
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public raspberriesService: RaspberriesService
  ) {}

  goTo(where: string) {
    this.router.navigate([where], { relativeTo: this.activatedRoute });
  }
}
