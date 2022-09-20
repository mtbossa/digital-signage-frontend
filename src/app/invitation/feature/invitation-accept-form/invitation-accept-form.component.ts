import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiErrorModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from "@taiga-ui/kit";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

import { InvitationsService } from "../../data-access/invitations.service";

export type ValidInvitationAcceptForm = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
};

@Component({
  selector: `app-invitation-accept-form`,
  templateUrl: `./invitation-accept-form.component.html`,
  styleUrls: [`./invitation-accept-form.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputCountModule,
    TuiInputPasswordModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class InvitationAcceptFormComponent implements OnInit {
  private token: string | null = null;

  formDisabled = false;
  invitationAcceptForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password_confirmation: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private invitationsService: InvitationsService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ invitation }) => {
      const emailControl = this.invitationAcceptForm.get("email");
      emailControl?.setValue(invitation.email);
      emailControl?.disable();
    });
  }

  onSubmit() {
    this.invitationAcceptForm.markAllAsTouched();

    if (this.invitationAcceptForm.invalid) return;

    const formRawData = this.invitationAcceptForm.getRawValue();

    this.invitationsService.update(this.token!, formRawData).subscribe((res) => {
      console.log(res);
      this.route.navigateByUrl("/login");
      this.alertService
        .open(`Conta criada com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
