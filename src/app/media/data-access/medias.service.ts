import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

export interface Media {
  id: number;
  description: string;
  type: "image" | "video";
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
    return this.http.delete(`${environment.apiUrl}/api/medias/${mediaId}`).pipe(take(1));
  }
}
