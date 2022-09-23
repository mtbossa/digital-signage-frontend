import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { TuiDropdownModule, TuiLinkModule } from "@taiga-ui/core";
import { Observable } from "rxjs";

import { AuthService, User } from "../../data-access/services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, TuiDropdownModule, TuiActiveZoneModule, TuiLinkModule],
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent {
  user: User;
  open = false;

  constructor(private authService: AuthService) {
    this.user = this.authService.getLoggedUserStorage()!;
  }

  onClick(): void {
    this.open = !this.open;
  }

  onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  logOut() {
    this.authService.logOut();
  }
}
