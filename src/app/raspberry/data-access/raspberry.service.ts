import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { User } from "src/app/shared/data-access/services/auth.service";
import { Listable } from "src/app/shared/feature/app-searchable-table/app-searchable-table/app-searchable-table.component";
import { environment } from "src/environments/environment";

import { ValidRaspberryForm } from "../feature/raspberry-form/raspberry-form.component";

export interface Raspberry {
  id: number;
  short_name: string;
  mac_address: string;
  serial_number: string;
  last_boot: string | null;
  observation: string;
  display_id: number | null;
  token?: Token;
  created_at: string;
  updated_at: string;
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

export type Key =
  | "id"
  | "short_name"
  | "mac_address"
  | "serial_number"
  | "last_boot"
  | "display_id";

@Injectable({
  providedIn: "root",
})
export class RaspberriesService implements Listable {
  onDeleteMessage = "Raspberry removido com sucesso!";
  primaryKeyColumnName = "id";

  constructor(private http: HttpClient) {}

  getPaginatedResponse<Raspberry>(
    page: number,
    size: number,
    search: string,
    searchField = "mac_address"
  ) {
    return this.http
      .get<PaginatedResponse<Raspberry>>(`${environment.apiUrl}/api/raspberries`, {
        params: {
          page,
          size,
          search,
          searchField,
        },
      })
      .pipe(take(1));
  }

  public show(raspberryId: number) {
    return this.http
      .get<Raspberry>(`${environment.apiUrl}/api/raspberries/${raspberryId}`)
      .pipe(take(1));
  }

  public update(raspberryId: number, data: ValidRaspberryForm) {
    return this.http
      .patch<User>(`${environment.apiUrl}/api/raspberries/${raspberryId}`, data)
      .pipe(take(1));
  }

  public create(data: ValidRaspberryForm) {
    return this.http
      .post<Raspberry>(`${environment.apiUrl}/api/raspberries`, data)
      .pipe(take(1));
  }

  remove(raspberryId: string) {
    return this.http
      .delete(`${environment.apiUrl}/api/raspberries/${raspberryId}`)
      .pipe(take(1));
  }
}
