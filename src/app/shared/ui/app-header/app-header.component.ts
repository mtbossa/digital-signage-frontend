import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { TuiButtonModule, TuiDropdownModule, TuiLinkModule } from "@taiga-ui/core";
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
  user$: Observable<User | null>;
  open = false;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.getLoggedUser();
  }

  onClick(): void {
    this.open = !this.open;
  }

  onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }
}
