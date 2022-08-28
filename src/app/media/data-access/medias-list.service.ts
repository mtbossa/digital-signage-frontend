import { Injectable } from "@angular/core";
import { tuiIsPresent } from "@taiga-ui/cdk";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  share,
  startWith,
  switchMap,
} from "rxjs";

import { Key, Media, MediasService } from "./medias.service";

@Injectable({
  providedIn: "root",
})
export class MediasListService {
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

  readonly data$: Observable<readonly Media[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map((mediasResponse) => mediasResponse.data.filter(tuiIsPresent)),
    startWith([])
  );

  constructor(private mediasService: MediasService) {}

  changePage(page: number): void {
    this.page$.next(page + 1);
  }
  changeSize(size: number): void {
    this.size$.next(size);
  }
  refresh() {
    this.refresh$.next(true);
  }
}
