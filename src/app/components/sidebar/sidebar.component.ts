import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Farm } from 'src/app/models/Farm';
import { MessageService } from 'src/app/_services/index';
import {MatListModule} from '@angular/material/list';
import { TidesService } from 'src/app/services/tides.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  // @Input means farms property can receive its value from its parent?
  // Because we are getting farms from the map component, sending it to the parent
  // And then this component accesses it from the parent!
  messages: any[] = [];
  tidesSubscription: Subscription;

  constructor(private messageService: MessageService, private tidesService: TidesService) {
    // subscribe to tideHeightObs Subject
    this.tidesSubscription = this.tidesService.getTideHeightObs().subscribe((tideHeight) => {
      this.messages.push(tideHeight.toString());
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.tidesSubscription.unsubscribe();
  }

  onButtonClicked() {
    this.messages = [];
  }
}
