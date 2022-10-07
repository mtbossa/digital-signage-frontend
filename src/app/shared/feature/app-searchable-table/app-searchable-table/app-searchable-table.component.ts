import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { tuiIsPresent, TuiLetModule, tuiPure } from "@taiga-ui/cdk";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiLoaderModule,
  TuiNotification,
} from "@taiga-ui/core";
import { TuiInputInlineModule, TuiInputModule } from "@taiga-ui/kit";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  share,
  startWith,
  Subscription,
  switchMap,
  take,
  tap,
} from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";

export interface Column {
  key: string;
  title: string;
}

export interface Listable {
  onDeleteMessage: string;
  primaryKeyColumnName: string;

  getPaginatedResponse: (
    page: number,
    size: number,
    search: string,
    searchField?: string
  ) => Observable<PaginatedResponse<any>>;

  remove: (id: string) => Observable<any>;
}

@Component({
  selector: "app-app-searchable-table",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    TuiInputModule,
  ],
  templateUrl: "./app-searchable-table.component.html",
  styleUrls: ["./app-searchable-table.component.scss"],
})
export class AppSearchableTableComponent implements OnInit {
  @Input() columns!: Column[];
  @Input() listableService!: Listable;

  private defaultColumns: Column[] = [
    {
      key: "actions",
      title: "",
    },
  ];

  request$!: Observable<PaginatedResponse<any> | null>;
  data$ = new BehaviorSubject<any[]>([]);
  loading$!: Observable<boolean>;
  total$!: Observable<number>;
  searchControl = new FormControl("", { nonNullable: true });
  search$ = this.searchControl.valueChanges.pipe(
    startWith(""),
    distinctUntilChanged(),
    debounceTime(500)
  );

  private readonly page$ = new BehaviorSubject(1);
  private readonly size$ = new BehaviorSubject(10);
  private refresh$ = new BehaviorSubject<boolean>(false);
  readonly direction$ = new BehaviorSubject<-1 | 1>(-1);

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.request$ = combineLatest([
      this.page$,
      this.size$,
      this.search$,
      this.refresh$,
    ]).pipe(
      // zero time debounce for a case when both key and direction change
      debounceTime(0),
      switchMap(([page, size, search]) =>
        this.listableService
          .getPaginatedResponse(page, size, search)
          .pipe(startWith(null))
      ),
      tap((res) => this.data$.next(res?.data.filter(tuiIsPresent) ?? [])),
      share()
    );

    this.loading$ = this.request$.pipe(map((value) => !value));

    this.total$ = this.request$.pipe(
      filter(tuiIsPresent),
      map(({ total }) => total),
      startWith(1)
    );

    this.columns = [...this.columns, ...this.defaultColumns];
  }

  changePage(page: number): void {
    this.page$.next(page + 1);
  }
  changeSize(size: number): void {
    this.size$.next(size);
  }
  refresh() {
    this.refresh$.next(true);
  }

  goTo(where: string) {
    this.router.navigate([where], { relativeTo: this.activatedRoute });
  }

  remove(model: any): void {
    const primaryKey = model[this.listableService.primaryKeyColumnName];

    this.listableService.remove(primaryKey).subscribe({
      next: () => {
        this.data$.pipe(take(1)).subscribe((currentData) => {
          const dataWithoutRemoved = currentData.filter(
            (data) => data[this.listableService.primaryKeyColumnName] !== primaryKey
          );
          this.data$.next(dataWithoutRemoved);

          this.alertService
            .open(this.listableService.onDeleteMessage, {
              status: TuiNotification.Success,
            })
            .subscribe();

          this.cdr.markForCheck();
        });
      },
    });
  }

  edit(model: any): void {
    const primaryKey = model[this.listableService.primaryKeyColumnName];

    this.router.navigate([primaryKey, "editar"], { relativeTo: this.activatedRoute });
  }

  @tuiPure
  getColumNames(columns: Column[]): string[] {
    const test = columns
      .filter((column) => typeof column.key === "string")
      .map((column) => column.key as string);
    return test;
  }
}
