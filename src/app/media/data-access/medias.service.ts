import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, delay } from "rxjs";
import { environment } from "src/environments/environment";

export interface Media {
  id: number;
  description: number;
  type: string;
  size_kb: number;
  filename: string;
  extension: string;
  path: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: "root",
})
export class MediasService {
  constructor(private http: HttpClient) {}

  private medias$ = new BehaviorSubject<Media[] | null>(null);

  public fetchIndex() {
    this.http.get<Media[]>(`${environment.apiUrl}/api/medias`).subscribe((res) => {
      this.medias$.next(res);
    });
  }

  public getMedias() {
    return this.medias$.asObservable();
  }
}
