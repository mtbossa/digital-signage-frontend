import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { omit, pick, toFloat } from "radash";
import { delay, map, Observable, switchMap } from "rxjs";

import { Recurrence, RecurrencesService } from "../../data-access/recurrences.service";
import {
  RecurrenceFormComponent,
  ValidRecurrenceForm,
} from "../recurrence-form/recurrence-form.component";

@Component({
  selector: "app-recurrence-update-form",
  standalone: true,
  imports: [CommonModule, RecurrenceFormComponent],
  templateUrl: "./recurrence-update-form.component.html",
  styleUrls: ["./recurrence-update-form.component.scss"],
})
export class RecurrenceUpdateFormComponent implements OnInit {
  loading = true;
  recurrence$!: Observable<ValidRecurrenceForm>;
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private recurrenceService: RecurrencesService
  ) {}

  ngOnInit(): void {
    this.recurrence$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.recurrenceService.show(this.selectedId);
      })
    );
  }

  updateRecurrence($event: ValidRecurrenceForm) {
    this.recurrenceService.update(this.selectedId, $event).subscribe(() => {
      this.alertService
        .open(`Recorrência atualizada com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
