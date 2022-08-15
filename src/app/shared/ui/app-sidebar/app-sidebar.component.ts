import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiSidebarModule } from "@taiga-ui/addon-mobile";
import { TuiActiveZoneModule } from "@taiga-ui/cdk";
import { TuiLinkModule } from "@taiga-ui/core";
import { TuiAccordionModule } from "@taiga-ui/kit";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app-sidebar.component.html",
  styleUrls: ["./app-sidebar.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiLinkModule,
    TuiAccordionModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
  ],
})
export class AppSidebarComponent {
  open = false;

  readonly webApis = [`Common`, `Audio`, `Canvas`, `Geolocation`, `MIDI`, `Workers`];

  readonly tinkoff = [`Taiga-UI`, `ng-event-plugins`, `ng-polymorpheus`, `ng-dompurify`];

  toggle(open: boolean): void {
    this.open = open;
  }
}
