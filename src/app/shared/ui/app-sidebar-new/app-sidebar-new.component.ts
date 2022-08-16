import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiLinkModule } from "@taiga-ui/core";

@Component({
  selector: "app-sidebar-new",
  standalone: true,
  imports: [CommonModule, RouterModule, TuiLinkModule],
  templateUrl: "./app-sidebar-new.component.html",
  styleUrls: ["./app-sidebar-new.component.scss"],
})
export class AppSidebarNewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
