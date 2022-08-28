import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiLinkModule } from "@taiga-ui/core";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, TuiLinkModule],
  templateUrl: "./app-sidebar.component.html",
  styleUrls: ["./app-sidebar.component.scss"],
})
export class AppSidebarComponent {}
