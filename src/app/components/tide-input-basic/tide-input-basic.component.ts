import {
  Output,
  Component,
  OnDestroy,
  OnInit,
  EventEmitter,
} from '@angular/core';

import { MessageService } from 'src/app/services/index';
import { TidesService } from 'src/app/services/tides.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import { MainActions } from 'src/app/state/main.actions';
import { TideActions } from 'src/app/state/tide.actions';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss'],
})
export class TideInputBasicComponent implements OnInit, OnDestroy {
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  tideHeight: string = '';
  newDateTime: number = 1612612330;
  selectedDateTime: Date;
  private tidesSubscription: Subscription;

  // observable that will fire when we update the dateTime value
  dateTimeValuesChanged$ = new Subject<Date>();
  destroyed$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private tidesService: TidesService,
    private store: Store
  ) {


  }

  ngOnInit() {


    this.dateTimeValuesChanged$.pipe(
      tap(value => {
        this.calculateTideFromDate(value);
        // Also hide the sidenav! THis is very useful on mobile
        this.store.dispatch(new MainActions.ToggleSideBar());
        // TODO: THis should be done somewhere else.
        // TODO: Where is the best place to keep the tide and datetime in sync?
        this.store.dispatch(new TideActions.UpdateUnixTimestamp(moment(value).unix()))
        
      }),
      takeUntil(this.destroyed$)
    ).subscribe()
  }


  resetDateTime() {
    this.newDateTime = 0;
  }

  calculateTide(dateTime: number): void {
    // Prompt the tides service to recalculate the global tideHeight variable
    this.tidesService.getHeightFromDateTime(dateTime);
  }

  calculateTideFromDate(selectedDate: any) {
    var unixTimestamp = moment(selectedDate).unix();
    this.tidesService.getHeightFromDateTime(unixTimestamp);

  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(this.tideHeight);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  }

  ngOnDestroy() {
    this.tidesSubscription.unsubscribe();
  }
}
