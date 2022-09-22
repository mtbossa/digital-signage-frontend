import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { RecurrencesService } from "../../data-access/recurrences.service";
import {
  RecurrenceFormComponent,
  ValidRecurrenceForm,
} from "../recurrence-form/recurrence-form.component";

@Component({
  selector: "app-recurrence-create-form",
  standalone: true,
  imports: [CommonModule, RecurrenceFormComponent],
  templateUrl: "./recurrence-create-form.component.html",
  styleUrls: ["./recurrence-create-form.component.scss"],
})
export class RecurrenceCreateFormComponent {
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private route: Router,
    private recurrencesService: RecurrencesService
  ) {}

  createRecurrence($event: ValidRecurrenceForm) {
    this.recurrencesService.create($event).subscribe({
      next: (res) => {
        this.route.navigate(["../recorrencias"]);
        this.alertService
          .open(`Recurrence criado com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
