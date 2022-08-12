import { Component } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app-sidebar.component.html",
  styleUrls: ["./app-sidebar.component.scss"],
})
export class AppSidebarComponent {
  open = false;

  readonly webApis = [`Common`, `Audio`, `Canvas`, `Geolocation`, `MIDI`, `Workers`];

  readonly tinkoff = [`Taiga-UI`, `ng-event-plugins`, `ng-polymorpheus`, `ng-dompurify`];

  toggle(open: boolean): void {
    this.open = open;
  }
}
