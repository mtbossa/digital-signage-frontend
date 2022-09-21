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
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
} from "@taiga-ui/kit";
import { isEqual } from "lodash";
import { map } from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

export type ValidRecurrenceForm = {
  name: string;
  size: number;
  width: number;
  height: number;
  store_id?: number | null;
};

@Component({
  selector: `app-recurrence-form`,
  templateUrl: `./recurrence-form.component.html`,
  styleUrls: [`./recurrence-form.component.scss`],
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
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class RecurrenceFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<ValidRecurrenceForm>();

  // If recurrenceData, means it's an update
  @Input() recurrenceData?: ValidRecurrenceForm;

  formDisabled = false;
  recurrenceForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    size: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(1000)],
    }),
    width: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(20000)],
    }),
    height: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(20000)],
    }),
    store_id: new FormControl<number | null>(null),
  });

  ngOnInit() {
    if (this.recurrenceData) {
      this.configureUpdate(this.recurrenceData);
    }
  }

  private configureUpdate(recurrenceData: ValidRecurrenceForm) {
    this.recurrenceForm.patchValue(recurrenceData);
    this.formDisabled = true;

    this.recurrenceForm.valueChanges
      .pipe(map((newFormData) => isEqual(newFormData, this.recurrenceData)))
      .subscribe((isEqual) => {
        if (!isEqual) {
          this.formDisabled = false;
        } else {
          this.formDisabled = true;
        }
      });
  }

  private handleUpdate(formData: ValidRecurrenceForm) {
    this.recurrenceData = formData;
    this.formDisabled = true;
    this.formSubmitted.emit(formData);
  }

  onSubmit() {
    this.recurrenceForm.markAllAsTouched();

    if (this.recurrenceForm.invalid) return;

    const formRawData = this.recurrenceForm.getRawValue();

    if (this.recurrenceData) {
      this.handleUpdate(formRawData);
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
