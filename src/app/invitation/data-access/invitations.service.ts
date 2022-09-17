import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { PaginatedResponse } from "src/app/shared/data-access/interfaces/PaginatedResponse.interface";
import { environment } from "src/environments/environment";

export interface Invitation {
  id: number;
  email: string;
  inviter: number;
  is_admin: boolean;
  store_id: number | null;
  created_at: string;
  updated_at: string;
  registered_at: string;
  token: string;
}

export type Key =
  | "email"
  | "inviter"
  | "is_admin"
  | "store_id"
  | "created_at"
  | "registered_at";

@Injectable({
  providedIn: "root",
})
export class InvitationsService {
  constructor(private http: HttpClient) {}

  private invitations$ = new BehaviorSubject<Invitation[] | null>(null);

  public fetchIndex(key: Key, direction: -1 | 1, page: number, size: number) {
    return this.http
      .get<PaginatedResponse<Invitation>>(`${environment.apiUrl}/api/invitations`, {
        params: {
          page,
          size,
        },
      })
      .pipe(take(1));
  }

  public show(invitationId: number) {
    return this.http
      .get<Invitation>(`${environment.apiUrl}/api/invitations/${invitationId}`)
      .pipe(take(1));
  }

  public getInvitations() {
    return this.invitations$.asObservable();
  }

  public remove(invitationId: number) {
    return this.http
      .delete(`${environment.apiUrl}/api/invitations/${invitationId}`)
      .pipe(take(1));
  }
}
