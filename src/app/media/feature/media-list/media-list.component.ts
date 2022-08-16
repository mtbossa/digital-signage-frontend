import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
