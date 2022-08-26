import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

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

  public getMedias() {
    return this.medias$.asObservable();
  }
}
