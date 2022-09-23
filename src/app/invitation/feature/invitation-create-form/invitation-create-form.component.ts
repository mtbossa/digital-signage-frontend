import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { InvitationsService } from "../../data-access/invitations.service";
import {
  InvitationFormComponent,
  ValidInvitationForm,
} from "../invitation-form/invitation-form.component";

@Component({
  selector: "app-invitation-create-form",
  standalone: true,
  imports: [CommonModule, InvitationFormComponent],
  templateUrl: "./invitation-create-form.component.html",
  styleUrls: ["./invitation-create-form.component.scss"],
})
export class InvitationCreateFormComponent {
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private route: Router,
    private invitationsService: InvitationsService
  ) {}

  createInvitation($event: ValidInvitationForm) {
    this.invitationsService.create($event).subscribe({
      next: (res) => {
        this.route.navigate(["../convites"]);
        this.alertService
          .open(`Convite criado com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
