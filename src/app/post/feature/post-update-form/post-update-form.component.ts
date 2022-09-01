import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { omit, pick, toFloat } from "radash";
import { delay, map, Observable, switchMap } from "rxjs";

import { Post, PostsService } from "../../data-access/posts.service";
import { PostFormComponent, ValidPostForm } from "../post-form/post-form.component";

@Component({
  selector: "app-post-update-form",
  standalone: true,
  imports: [CommonModule, PostFormComponent],
  templateUrl: "./post-update-form.component.html",
  styleUrls: ["./post-update-form.component.scss"],
})
export class PostUpdateFormComponent implements OnInit {
  loading = true;
  post$!: Observable<ValidPostForm>;
  selectedId!: number;

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private activatedRoute: ActivatedRoute,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    this.post$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get("id"));
        return this.postService.show(this.selectedId).pipe(
          map((post) => {
            const postFormData = pick(post, [
              "name",
              "height",
              "width",
              "size",
              "store_id",
            ]);
            return {
              ...postFormData,
              size: toFloat(postFormData.size),
            };
          })
        );
      })
    );
  }

  updatePost($event: ValidPostForm) {
    this.postService.update(this.selectedId, $event).subscribe(() => {
      this.alertService
        .open(`Post atualizado com sucesso!`, { status: TuiNotification.Success })
        .subscribe();
    });
  }
}
