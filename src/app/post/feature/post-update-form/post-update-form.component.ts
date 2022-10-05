import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { omit, pick, toFloat } from "radash";
import { delay, map, Observable, switchMap } from "rxjs";
import { MediasService } from "src/app/media/data-access/medias.service";
import { RecurrencesService } from "src/app/recurrence/data-access/recurrences.service";

import { Post, PostsService } from "../../data-access/posts.service";
import { PostFormComponent, ValidPostForm } from "../post-form/post-form.component";

@Component({
  selector: "app-post-update-form",
  standalone: true,
  imports: [CommonModule, PostFormComponent],
  templateUrl: "./post-update-form.component.html",
  styleUrls: ["./post-update-form.component.scss"],
})
export class PostUpdateFormComponent {
  loading = true;
  post$!: Observable<ValidPostForm>;
  medias$ = this.mediasService.getMediaOptions();
  recurrences$ = this.recurrencesService.getRecurrenceOptions();
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private mediasService: MediasService,
    private recurrencesService: RecurrencesService
  ) {
    this.post$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.postsService.show(this.selectedId);
      })
    );
  }

  updatePost($event: ValidPostForm) {
    this.postsService.update(this.selectedId, $event).subscribe(() => {
      this.alertService
        .open(`Post atualizado com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
