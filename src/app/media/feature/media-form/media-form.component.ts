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
  TuiFieldErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiProgressModule,
} from "@taiga-ui/kit";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

export type MediaForm = {
  description: string;
  file: File | null;
};

@Component({
  selector: `app-media-form`,
  templateUrl: `./media-form.component.html`,
  styleUrls: [`./media-form.component.scss`],
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
    TuiProgressModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class MediaFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<MediaForm>();

  @Input() uploadProgress?: number;
  // If mediaData, means it's an update
  @Input() mediaData?: { description: string; path: string };

  formDisabled = false;
  mediaForm = new FormGroup({
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
    if (this.mediaData) {
      this.configureUpdate(this.mediaData);
    } else {
      this.configureCreate();
    }
  }

  private configureCreate() {
    this.fileControl = new FormControl();
    this.fileControl.valueChanges.subscribe((file: File) =>
      this.mediaForm.get("file")?.setValue(file)
    );
  }

  private configureUpdate(mediaData: { description: string; path: string }) {
    this.mediaForm.get("file")?.disable();
    this.mediaForm.get("description")?.setValue(mediaData.description);
    this.mediaForm.get("description")?.valueChanges.subscribe(
      () =>
        // Form gets disabled when trying to update a media without changing the description
        // so when the user changed the description, we can enable the form back
        (this.formDisabled = false)
    );
  }

  removeFile(): void {
    // Since we'll only call this method when the input file component is in the screen
    // we can assert that we have the fileControl.
    this.fileControl!.setValue(null);
  }

  private handleUpdate(formData: MediaForm) {
    // Here we know for sure this.mediaData is set
    if (this.mediaData!.description === formData.description) {
      this.formDisabled = true;
    } else {
      this.mediaData!.description = formData.description;
      this.formDisabled = false;
      this.formSubmitted.emit(formData);
    }
  }

  onSubmit() {
    this.mediaForm.markAllAsTouched();

    if (this.mediaForm.invalid) return;

    const formRawData = this.mediaForm.getRawValue();

    if (this.mediaData) {
      this.handleUpdate(formRawData);
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
