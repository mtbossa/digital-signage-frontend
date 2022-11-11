import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiCheckboxLabeledModule,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
} from "@taiga-ui/kit";
import { isEqual } from "lodash";
import { map } from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

export type ValidInvitationForm = {
  email: string;
  is_admin: boolean;
  store_id: number | null;
};

@Component({
  selector: `app-invitation-form`,
  templateUrl: `./invitation-form.component.html`,
  styleUrls: [`./invitation-form.component.scss`],
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
    TuiCheckboxLabeledModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class InvitationFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<ValidInvitationForm>();

  // If invitationData, means it's an update
  @Input() invitationData?: ValidInvitationForm;

  formDisabled = false;
  invitationForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    is_admin: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    store_id: new FormControl<number | null>(null, {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    if (this.invitationData) {
      this.configureUpdate(this.invitationData);
    }
  }

  private configureUpdate(invitationData: ValidInvitationForm) {
    this.invitationForm.patchValue(invitationData);
    this.formDisabled = true;

    this.invitationForm.valueChanges
      .pipe(map((newFormData) => isEqual(newFormData, this.invitationData)))
      .subscribe((isEqual) => {
        if (!isEqual) {
          this.formDisabled = false;
        } else {
          this.formDisabled = true;
        }
      });
  }

  private handleUpdate(formData: ValidInvitationForm) {
    this.invitationData = formData;
    this.formDisabled = true;
    this.formSubmitted.emit(formData);
  }

  onSubmit() {
    this.invitationForm.markAllAsTouched();

    if (this.invitationForm.invalid) return;

    const formRawData = this.invitationForm.getRawValue();

    if (this.invitationData) {
      this.handleUpdate(formRawData);
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
