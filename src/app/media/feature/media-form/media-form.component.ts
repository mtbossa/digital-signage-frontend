import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
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
} from "@taiga-ui/kit";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";
import { environment } from "src/environments/environment";

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
export class MediaFormComponent {
  mediaForm = new FormGroup({
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    file: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
  });
  readonly fileControl = new FormControl();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((file: File) =>
      this.mediaForm.get("file")?.setValue(file)
    );
  }

  removeFile(): void {
    this.fileControl.setValue(null);
  }

  onSubmit() {
    this.mediaForm.markAllAsTouched();
    if (this.mediaForm.invalid) return;

    const formRawData = this.mediaForm.getRawValue();
    const formData = new FormData();

    Object.entries(formRawData).forEach(([key, value]) => {
      console.log(value);
      formData.append(key, value!);
    });

    this.http.post(`${environment.apiUrl}/api/medias`, formData).subscribe({
      next: (res) => console.log({ res }),
      error: (err) => console.log({ err }),
    });
  }
}
