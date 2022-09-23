import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import {
  Invitation,
  InvitationsService,
} from "src/app/invitation/data-access/invitations.service";

@Injectable({ providedIn: "root" })
export class InvitationResolver implements Resolve<Invitation> {
  constructor(private service: InvitationsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Invitation> {
    const invitationToken = route.params["invitationToken"];
    return this.service.show(invitationToken);
  }
}
