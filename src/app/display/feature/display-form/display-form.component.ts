import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  Type,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiErrorModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
} from "@taiga-ui/kit";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";
import { environment } from "src/environments/environment";

import { Display } from "../../data-access/displays.service";

export type DisplayForm = {
  description: string;
  file: File | null;
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
    TuiFieldErrorModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputFilesModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class DisplayFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<DisplayForm>();

  // If displayData, means it's an update
  @Input() displayData?: { description: string; path: string };

  formDisabled = false;
  displayForm = new FormGroup({
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    file: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
  });
  fileControl?: FormControl;

  ngOnInit() {
    if (this.displayData) {
      this.configureUpdate(this.displayData);
    } else {
      this.configureCreate();
    }
  }

  private configureCreate() {
    this.fileControl = new FormControl();
    this.fileControl.valueChanges.subscribe((file: File) =>
      this.displayForm.get("file")?.setValue(file)
    );
  }

  private configureUpdate(displayData: { description: string; path: string }) {
    this.displayForm.get("file")?.disable();
    this.displayForm.get("description")?.setValue(displayData.description);
    this.displayForm.get("description")?.valueChanges.subscribe(
      () =>
        // Form gets disabled when trying to update a display without changing the description
        // so when the user changed the description, we can enable the form back
        (this.formDisabled = false)
    );
  }

  removeFile(): void {
    // Since we'll only call this method when the input file component is in the screen
    // we can assert that we have the fileControl.
    this.fileControl!.setValue(null);
  }

  private handleUpdate(formData: DisplayForm) {
    // Here we know for sure this.displayData is set
    if (this.displayData!.description === formData.description) {
      this.formDisabled = true;
    } else {
      this.displayData!.description = formData.description;
      this.formDisabled = false;
      this.formSubmitted.emit(formData);
    }
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
