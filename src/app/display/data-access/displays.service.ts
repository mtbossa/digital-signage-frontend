import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

import { ValidDisplayForm } from "../feature/display-form/display-form.component";

export interface Display {
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
}

export type Key = "id" | "name" | "width" | "height" | "size" | "touch";

@Injectable({
  providedIn: "root",
})
export class DisplaysService {
  constructor(private http: HttpClient) {}

  private displays$ = new BehaviorSubject<Display[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http
      .get<PaginatedResponse<Display>>(`${environment.apiUrl}/api/displays`, {
        params: {
          page,
          size,
        },
      })
      .pipe(take(1));
  }

  public create(data: ValidDisplayForm) {
    return this.http
      .post<Display>(`${environment.apiUrl}/api/displays`, data)
      .pipe(take(1));
  }

  public show(displayId: number) {
    return this.http
      .get<Display>(`${environment.apiUrl}/api/displays/${displayId}`)
      .pipe(take(1));
  }

  // Can only update display description
  public update(displayId: number, data: ValidDisplayForm) {
    return this.http
      .patch(`${environment.apiUrl}/api/displays/${displayId}`, data)
      .pipe(take(1));
  }

  public getDisplays() {
    return this.displays$.asObservable();
  }

  public remove(displayId: number) {
    return this.http
      .delete(`${environment.apiUrl}/api/displays/${displayId}`)
      .pipe(take(1));
  }
}
