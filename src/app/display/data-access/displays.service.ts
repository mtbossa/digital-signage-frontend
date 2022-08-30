import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

export interface Display {
  id: number;
  name: string;
  observation: string;
  width: number;
  height: number;
  size: string;
  touch: boolean;
  created_at: string;
  updated_at: string;
}

export type Key = "id" | "name" | "width" | "height" | "size" | "touch";

@Injectable({
  providedIn: "root",
})
export class DisplaysService {
  constructor(private http: HttpClient) {}

  private displays$ = new BehaviorSubject<Display[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http.get<PaginatedResponse<Display>>(
      `${environment.apiUrl}/api/displays`,
      {
        params: {
          page,
          size,
        },
      }
    );
  }

  // Needs to be FormData since we need to upload the file
  public create(data: FormData) {
    return this.http.post(`${environment.apiUrl}/api/displays`, data).pipe(take(1));
  }

  public show(displayId: number) {
    return this.http
      .get<Display>(`${environment.apiUrl}/api/displays/${displayId}`)
      .pipe(take(1));
  }

  // Can only update display description
  public update(displayId: number, data: { description: string }) {
    return this.http
      .patch(`${environment.apiUrl}/api/displays/${displayId}`, data)
      .pipe(take(1));
  }

  public getDisplays() {
    return this.displays$.asObservable();
  }

  public remove(displayId: number) {
    return this.http.delete(`${environment.apiUrl}/api/displays/${displayId}`);
  }
}
