import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TuiLinkModule } from "@taiga-ui/core";

type Menu = {
  title: string;
  path: string;
  icon: string;
};

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, TuiLinkModule],
  templateUrl: "./app-sidebar.component.html",
  styleUrls: ["./app-sidebar.component.scss"],
})
export class AppSidebarComponent {
  menu: Array<Menu> = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "tuiIconChartLineLarge",
    },
    {
      title: "Mídias",
      path: "/midias",
      icon: "tuiIconVideo",
    },
    {
      title: "Posts",
      path: "/posts",
      icon: "tuiIconEyeOpen",
    },
    {
      title: "Recorrências",
      path: "/recorrencias",
      icon: "tuiIconCalendar",
    },
    {
      title: "Displays",
      path: "/displays",
      icon: "tuiIconVideo",
    },
    {
      title: "Raspberries",
      path: "/raspberries",
      icon: "tuiIconPin",
    },
    {
      title: "Convites",
      path: "/convites",
      icon: "tuiIconMail",
    },
  ];
}
