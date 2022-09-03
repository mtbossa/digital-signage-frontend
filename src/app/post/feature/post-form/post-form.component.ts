import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  TuiContextWithImplicit,
  TuiDay,
  TuiLetModule,
  tuiPure,
  TuiStringHandler,
  TuiTime,
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
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiSelectModule,
  TuiUnfinishedValidatorModule,
} from "@taiga-ui/kit";
import { isEqual } from "lodash";
import { delay, map, Observable, of } from "rxjs";
import { Media, MediasService } from "src/app/media/data-access/medias.service";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";

import { MediaOption, PostsService } from "../../data-access/posts.service";

export type ValidPostForm = {
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  media_id: number;
  expose_time: number | null;
};

@Component({
  selector: `app-post-form`,
  templateUrl: `./post-form.component.html`,
  styleUrls: [`./post-form.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputCountModule,
    TuiInputDateModule,
    TuiUnfinishedValidatorModule,
    TuiInputTimeModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiLoaderModule,
    TuiLetModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: CustomValidators,
    },
  ],
})
export class PostFormComponent implements OnInit {
  // Server request for items imitation
  @Output() formSubmitted = new EventEmitter<ValidPostForm>();

  // If postData, means it's an update
  @Input() postData?: ValidPostForm;
  @Input() medias$: Observable<MediaOption[] | null> = of([]);

  constructor(private post: PostsService) {}

  minStartDate = TuiDay.currentLocal();

  formDisabled = false;
  postForm = new FormGroup({
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    start_date: new FormControl<null | TuiDay>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end_date: new FormControl<null | TuiDay>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start_time: new FormControl<TuiTime | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end_time: new FormControl<TuiTime | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    expose_time: new FormControl<number | null>(null, {
      validators: [Validators.min(1000)],
    }),
    media_id: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    if (this.postData) {
      this.configureUpdate(this.postData);
    }
  }

  @tuiPure
  stringify(items: MediaOption[]): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, description }) => [id, description] as [number, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || ``;
  }

  private configureUpdate(postData: ValidPostForm) {
    // this.postForm.patchValue(postData);
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
    const validFormData = {
      ...formRawData,
      start_date: formRawData.start_date!.toJSON(),
      end_date: formRawData.end_date!.toJSON(),
      start_time: `${formRawData.start_time!.toString()}:00`,
      end_time: `${formRawData.end_time!.toString()}:00`,
    } as ValidPostForm;

    if (this.postData) {
      this.handleUpdate(validFormData);
    } else {
      this.formSubmitted.emit(validFormData);
    }
  }

  getMinEndDate() {
    const currentStartDate = this.postForm.get("start_date")?.value;
    if (!currentStartDate) return TuiDay.currentLocal();
    return currentStartDate;
  }
}
