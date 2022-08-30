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

import { Media } from "../../data-access/medias.service";

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
    this.mediaForm.patchValue(mediaData);
    this.mediaForm.get("description")?.valueChanges.subscribe(() => {
      if (this.formDisabled) {
        // Form gets disabled when trying to update a media without changing the description
        // so when the user changed the description, we can enable the form back
        this.formDisabled = false;
      }
    });
  }

  removeFile(): void {
    this.fileControl!.setValue(null);
  }

  onSubmit() {
    this.mediaForm.markAllAsTouched();

    if (this.mediaForm.invalid) return;

    const formRawData = this.mediaForm.getRawValue();

    if (this.mediaData) {
      if (this.mediaData?.description === formRawData.description) {
        this.formDisabled = true;
      } else {
        this.mediaData.description = formRawData.description;
        this.formDisabled = false;
        this.formSubmitted.emit(formRawData);
      }
    } else {
      this.formSubmitted.emit(formRawData);
    }
  }
}
