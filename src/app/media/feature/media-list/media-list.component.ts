import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { tuiIsPresent, TuiLetModule } from "@taiga-ui/cdk";
import { TuiButtonModule, TuiLoaderModule } from "@taiga-ui/core";
import { TUI_ARROW } from "@taiga-ui/kit";
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
export class MediaListComponent {
  columns = ["id", "description", "type", "filename", "size_kb"];

  private readonly page$ = new BehaviorSubject(1);
  private readonly size$ = new BehaviorSubject(10);
  readonly direction$ = new BehaviorSubject<-1 | 1>(-1);
  readonly sorter$ = new BehaviorSubject<Key>(`id`);
  search = ``;

  readonly request$ = combineLatest([
    this.sorter$,
    this.direction$,
    this.page$,
    this.size$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap((query) => this.mediasService.fetchIndex(...query).pipe(startWith(null))),
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

  onPage(page: number): void {
    this.page$.next(page + 1);
  }

  onSize(size: number): void {
    this.size$.next(size);
  }
}
