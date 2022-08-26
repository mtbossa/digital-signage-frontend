import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TuiDay, TuiTime } from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorModule,
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputModule,
} from "@taiga-ui/kit";
import { Subject } from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

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
    description: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    file: new FormControl<File | null>(null, Validators.required),
  });
  readonly fileControl = new FormControl();

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
    console.log(this.mediaForm.value);
  }
}
