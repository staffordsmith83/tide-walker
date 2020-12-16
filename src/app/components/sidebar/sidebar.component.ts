import { Component, Input, OnInit } from '@angular/core';
import { Farm } from 'src/app/models/Farm';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  // @Input means farms property can receive its value from its parent?
  // Because we are getting farms from the map component, sending it to the parent
  // And then this component accesses it from the parent!
  @Input() farms: Farm[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
