import { FormStyle, getLocaleMonthNames, TranslationWidth } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from "@taiga-ui/cdk";
import { startCase } from "lodash";
import { BehaviorSubject, Observable, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

import { ValidRecurrenceForm } from "../feature/recurrence-form/recurrence-form.component";

export interface Recurrence {
  id: number;
  description: string;
  isoweekday: number;
  day: number;
  month: number;
}

export interface IsoWeekday {
  isoweekday: number;
  name: string;
}

export interface Month {
  month: number;
  name: string;
}

export type Key = "id" | "description" | "isoweekday" | "day" | "month";

@Injectable({
  providedIn: "root",
})
export class RecurrencesService {
  constructor(private http: HttpClient) {}

  WEEK_DAYS: readonly IsoWeekday[] = [
    { isoweekday: 1, name: "Segunda" },
    { isoweekday: 2, name: "Terça" },
    { isoweekday: 3, name: "Quarta" },
    { isoweekday: 4, name: "Quinta" },
    { isoweekday: 5, name: "Sexta" },
    { isoweekday: 6, name: "Sábado" },
    { isoweekday: 7, name: "Domingo" },
  ];

  MONTHS: readonly Month[] = getLocaleMonthNames(
    "pt-BR",
    FormStyle.Format,
    TranslationWidth.Wide
  ).map((month, index) => ({ month: index + 1, name: startCase(month) }));

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

  @tuiPure
  stringifyIsoweekday(
    items: readonly IsoWeekday[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ isoweekday, name }) => [isoweekday, name] as [number, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || ``;
  }

  @tuiPure
  stringifyMonth(
    items: readonly Month[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ month, name }) => [month, name] as [number, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || ``;
  }

  @tuiPure
  getIsoWeekdayName(isoweekday: number) {
    const map = new Map(
      this.WEEK_DAYS.map(({ isoweekday, name }) => [isoweekday, name] as [number, string])
    );

    return map.get(isoweekday);
  }

  @tuiPure
  getMonthName(month: number) {
    const map = new Map(
      this.MONTHS.map(({ month, name }) => [month, name] as [number, string])
    );

    return map.get(month);
  }
}
