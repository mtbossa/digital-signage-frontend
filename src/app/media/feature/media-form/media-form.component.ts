import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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
  mediaForm = new FormGroup({
    description: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    file: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
  });
  readonly fileControl = new FormControl();

  constructor(
    private http: HttpClient,
    private route: Router,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService
  ) {}

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
      next: (res) => {
        this.route.navigate(["../midias"]);
        this.alertService
          .open(`Mídia criada com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
      error: (err) => console.log({ err }),
    });
  }
}
