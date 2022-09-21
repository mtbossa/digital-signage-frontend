import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

import { ValidRecurrenceForm } from "../feature/recurrence-form/recurrence-form.component";

export interface Recurrence {
  id: number;
  description: string;
  isoweekday: string;
  day: string;
  month: string;
}

export type Key = "id" | "description" | "isoweekday" | "day" | "month";

@Injectable({
  providedIn: "root",
})
export class RecurrencesService {
  constructor(private http: HttpClient) {}

  private recurrences$ = new BehaviorSubject<Recurrence[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http
      .get<PaginatedResponse<Recurrence>>(`${environment.apiUrl}/api/recurrences`, {
        params: {
          page,
          size,
        },
      })
      .pipe(take(1));
  }

  public create(data: ValidRecurrenceForm) {
    return this.http
      .post<Recurrence>(`${environment.apiUrl}/api/recurrences`, data)
      .pipe(take(1));
  }

  public show(recurrenceId: number) {
    return this.http
      .get<Recurrence>(`${environment.apiUrl}/api/recurrences/${recurrenceId}`)
      .pipe(take(1));
  }

  // Can only update recurrence description
  public update(recurrenceId: number, data: ValidRecurrenceForm) {
    return this.http
      .patch(`${environment.apiUrl}/api/recurrences/${recurrenceId}`, data)
      .pipe(take(1));
  }

  public getRecurrences() {
    return this.recurrences$.asObservable();
  }

  public remove(recurrenceId: number) {
    return this.http
      .delete(`${environment.apiUrl}/api/recurrences/${recurrenceId}`)
      .pipe(take(1));
  }
}
