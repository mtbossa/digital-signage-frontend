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

export type ValidDisplayForm = {
  name: string;
  size: number;
  width: number;
  height: number;
  store_id?: number | null;
};

@Component({
  selector: `app-display-form`,
  templateUrl: `./display-form.component.html`,
  styleUrls: [`./display-form.component.scss`],
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
export class DisplayFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<ValidDisplayForm>();

  // If displayData, means it's an update
  @Input() displayData?: ValidDisplayForm;

  formDisabled = false;
  displayForm = new FormGroup({
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
    if (this.displayData) {
      this.configureUpdate(this.displayData);
    }
  }

  private configureUpdate(displayData: ValidDisplayForm) {
    this.displayForm.patchValue(displayData);
    this.formDisabled = true;

    this.displayForm.valueChanges
      .pipe(map((newFormData) => isEqual(newFormData, this.displayData)))
      .subscribe((isEqual) => {
        if (!isEqual) {
          this.formDisabled = false;
        } else {
          this.formDisabled = true;
        }
      });
  }

  private handleUpdate(formData: ValidDisplayForm) {
    this.displayData = formData;
    this.formDisabled = true;
    this.formSubmitted.emit(formData);
  }

  onSubmit() {
    this.displayForm.markAllAsTouched();

    if (this.displayForm.invalid) return;

    const formRawData = this.displayForm.getRawValue();

    if (this.displayData) {
      this.handleUpdate(formRawData);
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
