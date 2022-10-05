import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { pick } from "radash";
import { map, Observable, switchMap } from "rxjs";
import { DisplaysService } from "src/app/display/data-access/displays.service";
import { PostsService } from "src/app/post/data-access/posts.service";

import { RaspberriesService } from "../../data-access/raspberry.service";
import {
  RaspberryFormComponent,
  ValidRaspberryForm,
} from "../raspberry-form/raspberry-form.component";

@Component({
  selector: "app-raspberry-update-form",
  standalone: true,
  imports: [CommonModule, RaspberryFormComponent],
  templateUrl: "./raspberry-update-form.component.html",
  styleUrls: ["./raspberry-update-form.component.scss"],
})
export class RaspberryUpdateFormComponent implements OnInit {
  loading = true;
  raspberry$!: Observable<ValidRaspberryForm>;
  displays$ = this.displayService.getDisplayOptions();
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private raspberriesService: RaspberriesService,
    private displayService: DisplaysService
  ) {}

  ngOnInit(): void {
    this.raspberry$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.raspberriesService
          .show(this.selectedId)
          .pipe(
            map((raspberry) =>
              pick(raspberry, [
                "short_name",
                "mac_address",
                "serial_number",
                "display_id",
              ])
            )
          );
      })
    );
  }

  updateRaspberry($event: ValidRaspberryForm) {
    this.raspberriesService.update(this.selectedId, $event).subscribe(() => {
      this.alertService
        .open(`Raspberry atualizado com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
