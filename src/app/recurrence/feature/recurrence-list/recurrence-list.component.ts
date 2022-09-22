import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { tuiIsPresent, TuiLetModule } from "@taiga-ui/cdk";
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
  tap,
} from "rxjs";

import {
  Key,
  Recurrence,
  RecurrencesService,
} from "../../data-access/recurrences.service";

@Component({
  selector: "app-recurrence-list",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
  ],
  templateUrl: "./recurrence-list.component.html",
  styleUrls: ["./recurrence-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecurrenceListComponent implements OnInit, OnDestroy {
  columns = ["id", "description", "isoweekday", "day", "month", "actions"];
  recurrences: Recurrence[] = [];

  private readonly page$ = new BehaviorSubject(1);
  private readonly size$ = new BehaviorSubject(10);
  private refresh$ = new BehaviorSubject<boolean>(false);
  readonly direction$ = new BehaviorSubject<-1 | 1>(-1);
  readonly sorter$ = new BehaviorSubject<Key>(`id`);
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
      this.recurrencesService
        .fetchIndex(sorter, direction, page, size)
        .pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));

  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(({ total }) => total),
    startWith(1)
  );

  readonly data$: Observable<Recurrence[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map((recurrencesResponse) => recurrencesResponse.data.filter(tuiIsPresent)),
    startWith([])
  );

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public recurrencesService: RecurrencesService
  ) {}

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subscription = this.data$.subscribe((res) => (this.recurrences = res));
    this.subscriptions = [subscription, ...this.subscriptions];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

  remove(recurrenceId: number): void {
    this.recurrencesService.remove(recurrenceId).subscribe({
      next: () => {
        this.recurrences = this.recurrences.filter(
          (recurrence) => recurrence.id !== recurrenceId
        );
        this.alertService
          .open(`Recurrence removido com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
        this.cdr.markForCheck();
      },
    });
  }

  edit(recurrenceId: number): void {
    this.router.navigate([recurrenceId, "editar"], { relativeTo: this.activatedRoute });
  }
}
