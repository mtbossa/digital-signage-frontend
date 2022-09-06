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
  TUI_DEFAULT_MATCHER,
  TuiContextWithImplicit,
  TuiDay,
  TuiHandler,
  tuiIsNumber,
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
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiMultiSelectModule,
  TuiSelectModule,
  TuiUnfinishedValidatorModule,
} from "@taiga-ui/kit";
import { isEqual } from "lodash";
import { BehaviorSubject, map, Observable, of, startWith, switchMap } from "rxjs";
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
  displays_ids: Array<number>;
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
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
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
  @Input() medias$: Observable<MediaOption[]> = of([]);

  readonly search$ = new BehaviorSubject<string>("");

  // Items only hold IDs
  readonly displays$ = this.search$.pipe(
    startWith(``),
    switchMap((search) =>
      this.post
        .getDisplayOptions()
        .pipe(
          map((items) =>
            items
              .filter(({ name }) => TUI_DEFAULT_MATCHER(name, search))
              .map(({ id }) => id)
          )
        )
    ),
    startWith(null) // <-- loading
  );

  // Stringify mapper that turns IDs to names
  readonly stringify$: Observable<
    TuiHandler<number | TuiContextWithImplicit<number>, string>
  > = this.post.getDisplayOptions().pipe(
    map((items) => new Map(items.map<[number, string]>(({ id, name }) => [id, name]))),
    startWith(new Map()),
    map(
      (map) => (id: number | TuiContextWithImplicit<number>) =>
        (tuiIsNumber(id) ? map.get(id) : map.get(id.$implicit)) || `Loading...`
    )
  );

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
    expose_time: new FormControl<number | null>(1000, {
      nonNullable: true,
      validators: [Validators.min(1000)],
    }),
    media_id: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    displays_ids: new FormControl<Array<number> | null>(null, {
      nonNullable: true,
    }),
  });

  constructor(private post: PostsService) {}

  ngOnInit() {
    this.postForm.get("expose_time")?.disable();
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

  transformDateToTuiDay(date: string) {
    const [year, month, day] = date.split("-");
    console.log({ year, month, day });
    return new TuiDay(Number(year), Number(month), Number(day));
  }

  transformTimeToTuiTime(time: string) {
    const [hours, minutes, seconds] = time.split(":");
    console.log({ hours, minutes, seconds });
    return new TuiTime(Number(hours), Number(minutes), Number(seconds));
  }

  private configureUpdate(postData: ValidPostForm) {
    // Disables all fields but description, since description is the only one which can be updated
    Object.keys(this.postForm.controls).forEach((key) => {
      if (key === "description") return;
      this.postForm.get(key)?.disable();
    });

    this.postForm.patchValue({
      ...postData,
      start_date: this.transformDateToTuiDay(postData.start_date),
      end_date: this.transformDateToTuiDay(postData.end_date),
      start_time: this.transformTimeToTuiTime(postData.start_time),
      end_time: this.transformTimeToTuiTime(postData.end_time),
    });

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

  onSearchChange(searchQuery: string | null): void {
    this.search$.next(searchQuery || "");
  }

  onMediaChanged(mediaType: "image" | "video") {
    const exposeTimeControl = this.postForm.get("expose_time");
    if (mediaType === "video") {
      exposeTimeControl?.setValue(null);
      exposeTimeControl?.disable();
    } else {
      exposeTimeControl?.enable();
      exposeTimeControl?.reset();
    }
  }
}
