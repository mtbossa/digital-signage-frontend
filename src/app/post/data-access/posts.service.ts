import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Display } from "src/app/display/data-access/displays.service";
import { Media } from "src/app/media/data-access/medias.service";
import { Recurrence } from "src/app/recurrence/data-access/recurrences.service";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

import { ValidPostForm } from "../feature/post-form/post-form.component";

export interface Post {
  id: number;
  description: string;
  showing: boolean;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  media_id: number;
  displays_ids: Array<number>;
  expose_time: number | null;
  recurrence_id: number | null;
  created_at: string;
  updated_at: string;
}

export type RecurrenceOption = Pick<Recurrence, "id" | "description">;
export type DisplayOption = Pick<Display, "id" | "name">;

export type Key =
  | "id"
  | "description"
  | "start_date"
  | "end_date"
  | "start_time"
  | "end_time"
  | "expose_time";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  constructor(private http: HttpClient) {}

  private posts$ = new BehaviorSubject<Post[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http
      .get<PaginatedResponse<Post>>(`${environment.apiUrl}/api/posts`, {
        params: {
          page,
          size,
        },
      })
      .pipe(take(1));
  }

  // Needs to be FormData since we need to upload the file
  public create(data: ValidPostForm) {
    return this.http.post<Post>(`${environment.apiUrl}/api/posts`, data).pipe(take(1));
  }

  public show(postId: number, withDisplaysIds = false) {
    return this.http
      .get<Post>(`${environment.apiUrl}/api/posts/${postId}`, {
        params: {
          withDisplaysIds,
        },
      })
      .pipe(take(1));
  }

  // Can only update post description
  public update(postId: number, data: ValidPostForm) {
    return this.http
      .patch(`${environment.apiUrl}/api/posts/${postId}`, data)
      .pipe(take(1));
  }

  public getPosts() {
    return this.posts$.asObservable();
  }

  public remove(postId: number) {
    return this.http.delete(`${environment.apiUrl}/api/posts/${postId}`).pipe(take(1));
  }

  public getRecurrenceOptions() {
    return this.http
      .get<RecurrenceOption[]>(`${environment.apiUrl}/api/posts/recurrences/options`)
      .pipe(take(1));
  }

  public getDisplayOptions() {
    return this.http
      .get<DisplayOption[]>(`${environment.apiUrl}/api/posts/displays/options`)
      .pipe(take(1));
  }
}
