import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TuiButtonModule } from "@taiga-ui/core";
import { Observable } from "rxjs";

import { Media, MediasService } from "../../data-access/medias.service";

@Component({
  selector: "app-media-list",
  standalone: true,
  imports: [CommonModule, TuiButtonModule],
  templateUrl: "./media-list.component.html",
  styleUrls: ["./media-list.component.scss"],
})
export class MediaListComponent implements OnInit {
  medias$: Observable<Media[] | null>;

  constructor(private mediasService: MediasService) {
    this.medias$ = this.mediasService.getMedias();
  }

  ngOnInit(): void {
    this.mediasService.fetchIndex();
  }
}
