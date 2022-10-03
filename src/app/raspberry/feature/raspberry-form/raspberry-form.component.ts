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
  TuiContextWithImplicit,
  TuiLetModule,
  tuiPure,
  TuiStringHandler,
} from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiSelectModule,
} from "@taiga-ui/kit";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { DisplayOption } from "src/app/post/data-access/posts.service";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";
import { isFormSameData } from "src/app/shared/utils/form-functions";

export type ValidRaspberryForm = {
  short_name: string;
  mac_address: string;
  serial_number: string;
  display_id: number | null;
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
    TuiSelectModule,
    TuiDataListModule,
    TuiLoaderModule,
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
  @Input() displays$: Observable<DisplayOption[]> = of([]);

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
    display_id: new FormControl<number | null>(null),
  });

  submitDisabledControl$ = new BehaviorSubject(false);
  isSubmitDisabled$ = this.submitDisabledControl$.asObservable();

  @tuiPure
  stringifyOptions(
    items: DisplayOption[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [number, string]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || ``;
  }

  ngOnInit() {
    if (this.raspberryData) {
      this.configureUpdate(this.raspberryData);
    }
  }

  private configureUpdate(raspberryData: ValidRaspberryForm) {
    this.raspberryForm.patchValue(raspberryData);
    this.isSubmitDisabled$ = merge(
      this.submitDisabledControl$.asObservable(),
      isFormSameData<ValidRaspberryForm>(this.raspberryForm, raspberryData)
    );
    this.submitDisabledControl$.next(true);
  }

  private handleUpdate(newFormData: ValidRaspberryForm) {
    this.updateCurrentData(newFormData);
    this.emitFormSubmitted(newFormData);
    this.submitDisabledControl$.next(true);
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
    this.configureUpdate(this.raspberryData);
  }

  private emitFormSubmitted(newFormData: ValidRaspberryForm) {
    this.formSubmitted.emit(newFormData);
  }
}
