import {
  CommonModule,
  FormStyle,
  getLocaleMonthNames,
  TranslationWidth,
} from "@angular/common";
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
  TuiContextWithImplicit,
  TuiLetModule,
  tuiPure,
  TuiStringHandler,
} from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiInputMonthModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from "@taiga-ui/kit";
import { camelCase, isEqual, startCase } from "lodash";
import { map } from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

import { RecurrencesService } from "../../data-access/recurrences.service";

export type ValidRecurrenceForm = {
  description: string;
  isoweekday: number | null;
  day: number | null;
  month: number | null;
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
    TuiSelectModule,
    TuiDataListModule,
    TuiLetModule,
    TuiInputNumberModule,
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
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    isoweekday: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.max(7)],
    }),
    day: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.max(31)],
    }),
    month: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.max(12)],
    }),
  });

  constructor(public recurrencesService: RecurrencesService) {}

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
