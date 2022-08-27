import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  Inject,
  TemplateRef,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
import { CrudPortalService } from "src/app/shared/feature/portals/crud-host/crud-portal.service";
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
  templates: Array<EmbeddedViewRef<unknown>> = [];

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

  constructor(
    private http: HttpClient,
    private route: Router,
    @Inject(CrudPortalService)
    private readonly crudPortalService: CrudPortalService
  ) {}

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((file: File) =>
      this.mediaForm.get("file")?.setValue(file)
    );
  }

  removeFile(): void {
    this.fileControl.setValue(null);
  }

  onSubmit(template: TemplateRef<unknown>) {
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
        this.route.navigate(["../medias"]);
        this.addTemplate(template);
        setTimeout(() => this.removeTemplate(), 2000);
      },
      error: (err) => console.log({ err }),
    });
  }

  addTemplate(template: TemplateRef<unknown>): void {
    this.templates = [...this.templates, this.crudPortalService.addTemplate(template)];
  }

  removeTemplate(): void {
    const viewRef = this.templates.pop();

    if (viewRef) {
      this.crudPortalService.removeTemplate(viewRef);
    }
  }
}
