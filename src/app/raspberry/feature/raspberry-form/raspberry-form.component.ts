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
import { TuiLetModule } from "@taiga-ui/cdk";
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
import { BehaviorSubject, map } from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

export type ValidRaspberryForm = {
  short_name: string;
  mac_address: string;
  serial_number: string;
};

@Component({
  selector: `app-raspberry-form`,
  templateUrl: `./raspberry-form.component.html`,
  styleUrls: [`./raspberry-form.component.scss`],
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
    TuiLetModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class RaspberryFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<ValidRaspberryForm>();

  // If raspberryData, means it's an update
  @Input() raspberryData?: ValidRaspberryForm;

  formDisabled$ = new BehaviorSubject(false);
  raspberryForm = new FormGroup({
    short_name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    mac_address: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    serial_number: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  ngOnInit() {
    if (this.raspberryData) {
      this.configureUpdate(this.raspberryData);
    }
  }

  private configureUpdate(raspberryData: ValidRaspberryForm) {
    this.raspberryForm.patchValue(raspberryData);
    this.formDisabled$.next(true);

    this.raspberryForm.valueChanges
      .pipe(map((newFormData) => isEqual(newFormData, this.raspberryData)))
      .subscribe((isEqual) => {
        if (!isEqual) {
          this.formDisabled$.next(false);
        } else {
          this.formDisabled$.next(true);
        }
      });
  }

  private handleUpdate(newFormData: ValidRaspberryForm) {
    this.updateCurrentData(newFormData);
    this.emitFormSubmitted(newFormData);
    this.formDisabled$.next(true);
  }

  onSubmit() {
    this.raspberryForm.markAllAsTouched();

    if (this.raspberryForm.invalid) return;

    const formRawData = this.raspberryForm.getRawValue();

    if (this.raspberryData) {
      this.handleUpdate(formRawData);
    } else {
      this.emitFormSubmitted(formRawData);
    }
  }

  private updateCurrentData(newFormData: ValidRaspberryForm) {
    this.raspberryData = newFormData;
  }

  private emitFormSubmitted(newFormData: ValidRaspberryForm) {
    this.formSubmitted.emit(newFormData);
  }
}