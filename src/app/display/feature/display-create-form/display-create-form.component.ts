import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { DisplaysService } from "../../data-access/displays.service";
import {
  DisplayForm,
  DisplayFormComponent,
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

  createDisplay($event: DisplayForm) {
    const formData = new FormData();
    Object.entries($event).forEach(([key, value]) => {
      console.log(value);
      // We can assert that a file exists because the display-form component already
      // did this check for us, since it'll only emit the formSubmitted event when the
      // form is valid
      formData.append(key, value!);
    });
    this.displaysService.create(formData).subscribe({
      next: (res) => {
        this.route.navigate(["../midias"]);
        this.alertService
          .open(`Mídia criada com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
