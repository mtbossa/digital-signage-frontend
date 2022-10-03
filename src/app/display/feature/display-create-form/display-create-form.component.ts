import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { DisplaysService } from "../../data-access/displays.service";
import {
  DisplayFormComponent,
  ValidDisplayForm,
} from "../display-form/display-form.component";

@Component({
  selector: "app-display-create-form",
  standalone: true,
  imports: [CommonModule, DisplayFormComponent],
  templateUrl: "./display-create-form.component.html",
  styleUrls: ["./display-create-form.component.scss"],
})
export class DisplayCreateFormComponent {
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private route: Router,
    private displaysService: DisplaysService
  ) {}

  createDisplay($event: ValidDisplayForm) {
    this.displaysService.create($event).subscribe({
      next: (res) => {
        this.route.navigate(["../displays"]);
        this.alertService
          .open(`Display criado com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
