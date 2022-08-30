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

import { Key, Media, MediasService } from "../../data-access/medias.service";

@Component({
  selector: "app-media-list",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
  ],
  templateUrl: "./media-list.component.html",
  styleUrls: ["./media-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListComponent implements OnInit, OnDestroy {
  columns = ["id", "description", "type", "filename", "size_kb", "actions"];
  medias: Media[] = [];

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
      this.mediasService.fetchIndex(sorter, direction, page, size).pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));

  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(({ total }) => total),
    startWith(1)
  );

  readonly data$: Observable<Media[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map((mediasResponse) => mediasResponse.data.filter(tuiIsPresent)),
    startWith([])
  );

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mediasService: MediasService
  ) {}

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subscription = this.data$.subscribe((res) => (this.medias = res));
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

  remove(mediaId: number): void {
    this.mediasService.remove(mediaId).subscribe({
      next: () => {
        this.medias = this.medias.filter((media) => media.id !== mediaId);
        this.alertService
          .open(`Mídia removida com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
        this.cdr.markForCheck();
      },
    });
  }

  edit(mediaId: number): void {
    this.router.navigate([mediaId, "editar"], { relativeTo: this.activatedRoute });
  }
}
