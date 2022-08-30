import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { delay, Observable, switchMap } from "rxjs";

import { Media, MediasService } from "../../data-access/medias.service";
import { MediaForm, MediaFormComponent } from "../media-form/media-form.component";

@Component({
  selector: "app-media-update-form",
  standalone: true,
  imports: [CommonModule, MediaFormComponent],
  templateUrl: "./media-update-form.component.html",
  styleUrls: ["./media-update-form.component.scss"],
})
export class MediaUpdateFormComponent implements OnInit {
  loading = true;
  media$!: Observable<Media>;
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private mediaService: MediasService
  ) {}

  ngOnInit(): void {
    this.media$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.mediaService.show(this.selectedId);
      })
    );
  }

  updateMedia($event: MediaForm) {
    this.mediaService
      .update(this.selectedId, { description: $event.description })
      .subscribe(() => {
        this.alertService
          .open(`Mídia atualizada com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      });
  }
}
