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
import { ActivatedRoute, Router } from "@angular/router";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { tuiIsPresent, TuiLetModule, tuiPure } from "@taiga-ui/cdk";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiLoaderModule,
  TuiNotification,
} from "@taiga-ui/core";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
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
import { Key } from "src/app/raspberry/data-access/raspberry.service";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";

@Component({
  selector: "app-app-searchable-table",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
  ],
  templateUrl: "./app-searchable-table.component.html",
  styleUrls: ["./app-searchable-table.component.scss"],
})
export class AppSearchableTableComponent<T> {
  @Input() columns!: { key: keyof T; title: string }[];
  @Input() getDataRequest$!: (
    key: Key,
    direction: -1 | 1,
    page: number,
    size: number
  ) => Observable<PaginatedResponse<T>>;
  @Input() deleteModelRequest$!: (modelKey: number | string) => Observable<any>;
  @Input() modelPrimaryKey!: keyof T;

  private readonly page$ = new BehaviorSubject(1);
  private readonly size$ = new BehaviorSubject(10);
  private refresh$ = new BehaviorSubject<boolean>(false);
  readonly direction$ = new BehaviorSubject<-1 | 1>(-1);
  readonly sorter$ = new BehaviorSubject<Key>(`id`);
  data$ = new BehaviorSubject<T[]>([]);
  search = ``;

  readonly request$ = combineLatest([
    this.sorter$,
    this.direction$,
    this.page$,
    this.size$,
    this.refresh$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(([sorter, direction, page, size]) =>
      this.getDataRequest$(sorter, direction, page, size).pipe(startWith(null))
    ),
    tap((res) => this.data$.next(res?.data.filter(tuiIsPresent) ?? [])),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));

  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(({ total }) => total),
    startWith(1)
  );

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  private subscriptions: Subscription[] = [];

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

  remove(model: T): void {
    const primaryKey = model[this.modelPrimaryKey] as string | number;

    this.deleteModelRequest$(primaryKey).subscribe({
      next: () => {
        this.data$.pipe(take(1)).subscribe((currentData) => {
          const dataWithoutRemoved = currentData.filter(
            (data) => data[this.modelPrimaryKey as keyof T] !== primaryKey
          );
          this.data$.next(dataWithoutRemoved);
          this.alertService
            .open(`Raspberry removido com sucesso!`, { status: TuiNotification.Success })
            .subscribe();
          this.cdr.markForCheck();
        });
      },
    });
  }

  edit(model: T): void {
    const primaryKey = model[this.modelPrimaryKey] as string | number;

    this.router.navigate([primaryKey, "editar"], { relativeTo: this.activatedRoute });
  }

  @tuiPure
  getColumNames(columns: { key: keyof T; title: string }[]): string[] {
    const test = columns
      .filter((column) => typeof column.key === "string")
      .map((column) => column.key as string);
    return test;
  }
}
