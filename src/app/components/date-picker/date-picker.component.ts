import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TidesService } from 'src/app/services/tides.service';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import { MainActions } from 'src/app/state/main.actions';
import { TideActions } from 'src/app/state/tide.actions';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  selected: Date | null;

  // TODO
  // select date observable from state
  // make datepicker get its value from this observable
  // when datepicker is clicked, update the state
  // MAYBE hide sidepanel when date selected, if on mobile

  constructor(private tidesService: TidesService, private store: Store) {}

  ngOnInit(): void {}

  dateChanged(event) {
    console.log(event);
    debugger;

    // TODO: Simplify this chain of events
    this.tidesService.updateTideHeightFromApi(event);
    var unixTimestamp = moment(event).unix();
    this.tidesService.updateTideHeightFromApi(unixTimestamp);
    this.store.dispatch(new MainActions.ToggleSideBar());
    this.store.dispatch(new TideActions.UpdateUnixTimestamp(moment(event).unix()));
    this.tidesService.updateTidesArray();
  }
}
