import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/index';
import { TidesService } from 'src/app/services/tides.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  tidesHistory: any[] = [];
  tidesSubscription: Subscription;
  tideHeight: string = '0.0';


  constructor(
    private messageService: MessageService,
    private tidesService: TidesService
  ) {
    
    // // subscribe to tideHeightObs Subject
    // this.tidesSubscription = this.tidesService
    //   .getTideHeightObs()
    //   .subscribe((tideHeight) => {
    //     this.tidesHistory.push(tideHeight.toString());
    //   });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.tidesSubscription.unsubscribe();
  }

  onButtonClicked() {
    this.tidesHistory = [];
  }

  onNewTideReceived(userTideHeight: string) {
    this.tideHeight = userTideHeight;
    console.log(
      'New tide height received by App Component: ' + this.tideHeight
    );
  }

  getDailyClicked() {
    this.tidesService.getDailyTidesArray()
  }
}
