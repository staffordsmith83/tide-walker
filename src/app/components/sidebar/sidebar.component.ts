import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/index';
import { TidesService } from 'src/app/services/tides.service';
import { TideStateModel } from 'src/app/state/tide.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  tidesHistory: any[] = [];
  tidesSubscription: Subscription;
  tideHeight: string = '0.0';
  legendGraphicUrl: string;

  // @Select((state) => (state.tide as TideStateModel).legendGraphicUrl) legendGraphicUrl$: Observable<string>;

  constructor(
    private messageService: MessageService,
    private tidesService: TidesService,
    private store: Store
  ) {
    // // subscribe to tideHeightObs Subject
    // this.tidesSubscription = this.tidesService
    //   .getTideHeightObs()
    //   .subscribe((tideHeight) => {
    //     this.tidesHistory.push(tideHeight.toString());
    //   });
  }

  ngOnInit(): void {
    this.legendGraphicUrl = this.store.selectSnapshot(
      (state) => (state.tide as TideStateModel).legendGraphicUrl
    );
  }

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
    this.tidesService.getDailyTidesArray();
  }
}
