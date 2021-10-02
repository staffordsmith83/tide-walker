import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TideStateModel } from 'src/app/state/tide.state';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  // Get access to the state:
  @Select(state => (state.tide as TideStateModel).unixTimestamp) unixTimeStamp$: Observable<number>;
  @Select(state => (state.tide as TideStateModel).tideHeight) tideHeight$: Observable<string>;

  constructor() { }

  ngOnInit(): void {
  }

}
