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
} from "rxjs";

import { Key, RaspberriesService, Raspberry } from "../../data-access/raspberry.service";

@Component({
  selector: "app-raspberry-list",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
  ],
  templateUrl: "./raspberry-list.component.html",
  styleUrls: ["./raspberry-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaspberryListComponent implements OnInit, OnDestroy {
  columns = [
    "id",
    "short_name",
    "mac_address",
    "serial_number",
    "last_boot",
    "display_id",
    "actions",
  ];
  raspberries: Raspberry[] = [];

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
      this.raspberriesService
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

  readonly data$: Observable<Raspberry[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map((raspberriesResponse) => raspberriesResponse.data.filter(tuiIsPresent)),
    startWith([])
  );

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private raspberriesService: RaspberriesService
  ) {}

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subscription = this.data$.subscribe((res) => (this.raspberries = res));
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

  remove(raspberryId: number): void {
    this.raspberriesService.remove(raspberryId).subscribe({
      next: () => {
        this.raspberries = this.raspberries.filter(
          (raspberry) => raspberry.id !== raspberryId
        );
        this.alertService
          .open(`Raspberry removido com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
        this.cdr.markForCheck();
      },
    });
  }

  edit(raspberryId: number): void {
    this.router.navigate([raspberryId, "editar"], { relativeTo: this.activatedRoute });
  }
}
