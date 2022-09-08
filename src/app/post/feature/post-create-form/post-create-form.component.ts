import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { PostsService } from "../../data-access/posts.service";
import { PostFormComponent, ValidPostForm } from "../post-form/post-form.component";

@Component({
  selector: "app-post-create-form",
  standalone: true,
  imports: [CommonModule, PostFormComponent],
  templateUrl: "./post-create-form.component.html",
  styleUrls: ["./post-create-form.component.scss"],
})
export class PostCreateFormComponent {
  medias$ = this.postsService.getMediaOptions();

  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private route: Router,
    private postsService: PostsService
  ) {}

  createPost($event: ValidPostForm) {
    this.postsService.create($event).subscribe({
      next: (res) => {
        this.route.navigate(["../posts"]);
        this.alertService
          .open(`Post criado com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
