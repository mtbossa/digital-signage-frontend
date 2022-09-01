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

export type ValidPostForm = {
  name: string;
  size: number;
  width: number;
  height: number;
  store_id?: number | null;
};

@Component({
  selector: `app-post-form`,
  templateUrl: `./post-form.component.html`,
  styleUrls: [`./post-form.component.scss`],
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
export class PostFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<ValidPostForm>();

  // If postData, means it's an update
  @Input() postData?: ValidPostForm;

  formDisabled = false;
  postForm = new FormGroup({
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
    if (this.postData) {
      this.configureUpdate(this.postData);
    }
  }

  private configureUpdate(postData: ValidPostForm) {
    this.postForm.patchValue(postData);
    this.formDisabled = true;

    this.postForm.valueChanges
      .pipe(map((newFormData) => isEqual(newFormData, this.postData)))
      .subscribe((isEqual) => {
        if (!isEqual) {
          this.formDisabled = false;
        } else {
          this.formDisabled = true;
        }
      });
  }

  private handleUpdate(formData: ValidPostForm) {
    this.postData = formData;
    this.formDisabled = true;
    this.formSubmitted.emit(formData);
  }

  onSubmit() {
    this.postForm.markAllAsTouched();

    if (this.postForm.invalid) return;

    const formRawData = this.postForm.getRawValue();

    if (this.postData) {
      this.handleUpdate(formRawData);
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
