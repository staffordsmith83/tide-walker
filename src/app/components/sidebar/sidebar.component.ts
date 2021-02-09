import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/_services/index';
import { MatListModule } from '@angular/material/list';
import { TidesService } from 'src/app/services/tides.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  tidesHistory: any[] = [];
  tidesSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private tidesService: TidesService
  ) {
    // subscribe to tideHeightObs Subject
    this.tidesSubscription = this.tidesService
      .getTideHeightObs()
      .subscribe((tideHeight) => {
        this.tidesHistory.push(tideHeight.toString());
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.tidesSubscription.unsubscribe();
  }

  onButtonClicked() {
    this.tidesHistory = [];
  }
}
