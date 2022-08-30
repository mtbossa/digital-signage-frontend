import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";
import { environment } from "src/environments/environment";

import { MediaForm } from "../feature/media-form/media-form.component";

interface PaginatedResponse<T> {
  current_page: number;
  data: Array<T>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}
export interface Media {
  id: number;
  description: string;
  type: string;
  size_kb: number;
  filename: string;
  extension: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export type Key = "id" | "description" | "type" | "size_kb" | "filename";

@Injectable({
  providedIn: "root",
})
export class MediasService {
  constructor(private http: HttpClient) {}

  private medias$ = new BehaviorSubject<Media[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http.get<PaginatedResponse<Media>>(`${environment.apiUrl}/api/medias`, {
      params: {
        page,
        size,
      },
    });
  }

  // Needs to be FormData since we need to upload the file
  public create(data: FormData) {
    return this.http.post(`${environment.apiUrl}/api/medias`, data).pipe(take(1));
  }

  public show(mediaId: number) {
    return this.http
      .get<Media>(`${environment.apiUrl}/api/medias/${mediaId}`)
      .pipe(take(1));
  }

  // Can only update media description
  public update(mediaId: number, data: { description: string }) {
    return this.http
      .patch(`${environment.apiUrl}/api/medias/${mediaId}`, data)
      .pipe(take(1));
  }

  public getMedias() {
    return this.medias$.asObservable();
  }

  public remove(mediaId: number) {
    return this.http.delete(`${environment.apiUrl}/api/medias/${mediaId}`);
  }
}
