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

import { Key, Post, PostsService } from "../../data-access/posts.service";

@Component({
  selector: "app-post-list",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiTableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
  ],
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit, OnDestroy {
  columns = [
    "id",
    "description",
    "start_date",
    "end_date",
    "start_time",
    "end_time",
    "expose_time",
    "actions",
  ];
  posts: Post[] = [];

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
      this.postsService.fetchIndex(sorter, direction, page, size).pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));

  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(({ total }) => total),
    startWith(1)
  );

  readonly data$: Observable<Post[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map((postsResponse) => postsResponse.data.filter(tuiIsPresent)),
    startWith([])
  );

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService
  ) {}

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subscription = this.data$.subscribe((res) => (this.posts = res));
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

  test(item: any) {
    console.log(item);
    return item.id;
  }

  remove(postId: number): void {
    this.postsService.remove(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.alertService
          .open(`Post removido com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
        this.cdr.markForCheck();
      },
    });
  }

  edit(postId: number): void {
    this.router.navigate([postId, "editar"], { relativeTo: this.activatedRoute });
  }
}
