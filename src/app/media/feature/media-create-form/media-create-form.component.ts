import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TuiAlertService, TuiNotification } from "@taiga-ui/core";
import { environment } from "src/environments/environment";

import { MediasService } from "../../data-access/medias.service";
import { MediaForm, MediaFormComponent } from "../media-form/media-form.component";

@Component({
  selector: "app-media-create-form",
  standalone: true,
  imports: [CommonModule, MediaFormComponent],
  templateUrl: "./media-create-form.component.html",
  styleUrls: ["./media-create-form.component.scss"],
})
export class MediaCreateFormComponent {
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private http: HttpClient,
    private route: Router,
    private mediasService: MediasService
  ) {}

  createMedia($event: MediaForm) {
    const formData = new FormData();
    Object.entries($event).forEach(([key, value]) => {
      console.log(value);
      formData.append(key, value!);
    });
    this.mediasService.create(formData).subscribe({
      next: (res) => {
        this.route.navigate(["../midias"]);
        this.alertService
          .open(`Mídia criada com sucesso!`, { status: TuiNotification.Success })
          .subscribe();
      },
    });
  }
}
