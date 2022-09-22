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
  TuiExpandModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiCheckboxLabeledModule,
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
import { omit, pick } from "radash";
import {
  BehaviorSubject,
  combineLatest,
  delay,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import CustomValidators from "src/app/shared/data-access/validators/CustomValidators";
import { disableAllFormControlsBut } from "src/app/shared/utils/form-functions";

import {
  DisplayOption,
  MediaOption,
  PostsService,
  RecurrenceOption,
} from "../../data-access/posts.service";

export type ValidPostForm = {
  description: string;
  start_date?: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  media_id: number;
  recurrence_id?: number | null;
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
    TuiCheckboxLabeledModule,
    TuiExpandModule,
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
  @Input() medias$: Observable<MediaOption[]> = of([]);
  @Input() recurrences$: Observable<RecurrenceOption[]> = of([]);

  private readonly displaySearch$ = new BehaviorSubject<string>("");
  readonly displaysOptionsRequest$ = combineLatest([this.displaySearch$]).pipe(
    switchMap(([search]) => this.post.getDisplayOptions()),
    startWith(null),
    shareReplay(1)
  );
  readonly displaysIds$ = this.displaysOptionsRequest$.pipe(
    map((items) => items?.map(({ id }) => id) ?? null)
  );
  readonly displaysStringify$: Observable<
    TuiHandler<number | TuiContextWithImplicit<number>, string>
  > = this.displaysOptionsRequest$.pipe(
    map(
      (items) => new Map(items?.map<[number, string]>(({ id, name }) => [id, name]) ?? [])
    ),
    map(
      (map) => (id: number | TuiContextWithImplicit<number>) =>
        (tuiIsNumber(id) ? map.get(id) : map.get(id.$implicit)) || `Loading...`
    )
  );

  latestExposeTime?: number | null;
  minStartDate = TuiDay.currentLocal();
  formDisabled = false;
  postForm = new FormGroup({
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    start_date: new FormControl<null | TuiDay>(null, {
      nonNullable: true,
    }),
    end_date: new FormControl<null | TuiDay>(null, {
      nonNullable: true,
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
    recurrence_id: new FormControl<number | null>(null, {
      nonNullable: true,
    }),
    displays_ids: new FormControl<Array<number> | null>(null, {
      nonNullable: true,
    }),
  });

  isRecurrent = new FormControl<boolean>(true);

  get exposeTimeFormControl() {
    return this.postForm.get("expose_time");
  }

  constructor(private post: PostsService) {}

  ngOnInit() {
    this.isRecurrent.valueChanges.subscribe((isRecurrent) => {
      if (isRecurrent) {
        this.postForm.get("recurrence_id")?.enable();
        this.postForm.get("recurrence_id")?.addValidators([Validators.required]);
        this.postForm.get("start_date")?.disable();
        this.postForm.get("start_date")?.removeValidators([Validators.required]);
        this.postForm.get("end_date")?.disable();
        this.postForm.get("end_date")?.removeValidators([Validators.required]);
      } else {
        this.postForm.get("recurrence_id")?.disable();
        this.postForm.get("recurrence_id")?.removeValidators([Validators.required]);
        this.postForm.get("start_date")?.enable();
        this.postForm.get("start_date")?.addValidators([Validators.required]);
        this.postForm.get("end_date")?.enable();
        this.postForm.get("end_date")?.addValidators([Validators.required]);
      }
    });
    if (this.postData) {
      this.configureUpdate(this.postData);
    }
  }

  onSubmit() {
    this.postForm.markAllAsTouched();

    if (this.postForm.invalid) return;

    this.formDisabled = true;

    const formRawData = this.postForm.getRawValue();
    let validFormData: ValidPostForm;

    if (formRawData.recurrence_id) {
      validFormData = {
        ...omit(formRawData, ["start_date", "end_date"]),
        start_time: `${formRawData.start_time!.toString()}:00`,
        end_time: `${formRawData.end_time!.toString()}:00`,
      } as ValidPostForm;
    } else {
      validFormData = {
        ...omit(formRawData, ["recurrence_id"]),
        start_date: formRawData.start_date!.toJSON(),
        end_date: formRawData.end_date!.toJSON(),
        start_time: `${formRawData.start_time!.toString()}:00`,
        end_time: `${formRawData.end_time!.toString()}:00`,
      } as ValidPostForm;
    }

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
    this.displaySearch$.next(searchQuery || "");
  }

  onMediaChanged(mediaType: "image" | "video") {
    this.latestExposeTime = this.exposeTimeFormControl?.value;
    if (mediaType === "video") {
      this.exposeTimeFormControl?.setValue(null);
      this.exposeTimeFormControl?.disable();
    } else {
      this.exposeTimeFormControl?.enable();
      if (this.latestExposeTime) {
        this.exposeTimeFormControl?.setValue(this.latestExposeTime);
      } else {
        this.exposeTimeFormControl?.reset();
      }
    }
  }

  @tuiPure
  stringifyOptions(
    items: MediaOption[] | RecurrenceOption[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, description }) => [id, description] as [number, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || ``;
  }

  private configureUpdate(postData: ValidPostForm) {
    this.formDisabled = true;
    this.isRecurrent.setValue(!!postData.recurrence_id);
    this.isRecurrent.disable();
    disableAllFormControlsBut(["description", "displays_ids"], this.postForm);
    if (!postData.recurrence_id) {
      this.postForm.patchValue({
        ...postData,
        start_date: this.transformDateToTuiDay(postData.start_date!),
        end_date: this.transformDateToTuiDay(postData.end_date!),
        start_time: this.transformTimeToTuiTime(postData.start_time),
        end_time: this.transformTimeToTuiTime(postData.end_time),
      });
    } else {
      this.postForm.patchValue({
        ...omit(postData, ["start_date", "end_date"]),
        start_time: this.transformTimeToTuiTime(postData.start_time),
        end_time: this.transformTimeToTuiTime(postData.end_time),
      });
    }

    this.postForm.valueChanges
      .pipe(
        map((newFormData) =>
          isEqual(newFormData, pick(this.postData!, ["description", "displays_ids"]))
        )
      )
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

  private transformDateToTuiDay(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return new TuiDay(year, month, day);
  }

  private transformTimeToTuiTime(time: string) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return new TuiTime(hours, minutes, seconds);
  }
}
