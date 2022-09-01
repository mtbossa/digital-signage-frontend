import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

import { ValidPostForm } from "../feature/post-form/post-form.component";

export interface Post {
  id: number;
  name: string;
  observation: string;
  width: number;
  height: number;
  size: string;
  touch: boolean;
  store_id: number | null;
  created_at: string;
  updated_at: string;
  token?: Token;
}

interface Token {
  accessToken: {
    abilities: Array<string>;
    created_at: string;
    id: number;
    name: string;
    tokenable_id: number;
    tokenable_type: string;
    updated_at: string;
  };
  plainTextToken: string;
}

export type Key = "id" | "name" | "width" | "height" | "size" | "touch";

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

  public show(postId: number) {
    return this.http.get<Post>(`${environment.apiUrl}/api/posts/${postId}`).pipe(take(1));
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
}
