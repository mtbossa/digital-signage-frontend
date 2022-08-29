import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { TuiTableModule, TuiTablePaginationModule } from "@taiga-ui/addon-table";
import { tuiIsPresent, TuiLetModule } from "@taiga-ui/cdk";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiLoaderModule,
  TuiNotification,
} from "@taiga-ui/core";
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
import { MediasListService } from "../../data-access/medias-list.service";

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
export class MediaListComponent implements OnInit {
  columns = ["id", "description", "type", "filename", "size_kb", "actions"];
  medias: Media[] = [];

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private mediasService: MediasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public mediasListService: MediasListService
  ) {}

  ngOnInit() {
    this.mediasListService.data$.subscribe((res) => (this.medias = res));
  }

  onPage(page: number): void {
    this.mediasListService.changePage(page);
  }

  onSize(size: number): void {
    this.mediasListService.changeSize(size);
  }

  goTo(where: string) {
    this.router.navigate([where], { relativeTo: this.activatedRoute });
  }

  remove(item: Media): void {
    this.mediasService.remove(item.id).subscribe({
      next: () => {
        this.medias = this.medias.filter((media) => media.id !== item.id);
        this.alertService
          .open(`Mídia removida com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
        this.cdr.markForCheck();
      },
    });
  }
}
