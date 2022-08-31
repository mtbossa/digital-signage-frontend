import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { delay, map, Observable, switchMap } from "rxjs";

import { Display, DisplaysService } from "../../data-access/displays.service";
import {
  DisplayFormComponent,
  ValidDisplayForm,
} from "../display-form/display-form.component";

@Component({
  selector: "app-display-update-form",
  standalone: true,
  imports: [CommonModule, DisplayFormComponent],
  templateUrl: "./display-update-form.component.html",
  styleUrls: ["./display-update-form.component.scss"],
})
export class DisplayUpdateFormComponent implements OnInit {
  loading = true;
  display$!: Observable<ValidDisplayForm>;
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private displayService: DisplaysService
  ) {}

  ngOnInit(): void {
    this.display$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.displayService.show(this.selectedId).pipe(
          map((display) => {
            const { name, width, height, size, touch, store_id } = display;
            return {
              name,
              width,
              height,
              size: Number(size),
              touch,
              store_id,
            };
          })
        );
      })
    );
  }

  updateDisplay($event: ValidDisplayForm) {
    this.displayService.update(this.selectedId, $event).subscribe(() => {
      this.alertService
        .open(`Display atualizado com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
