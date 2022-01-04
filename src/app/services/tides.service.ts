import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorldTidesResponse } from 'src/app/models/WorldTidesResponseModel';
import { config } from '../configs/config';
import { TideActions } from '../state/tide.actions';


@Injectable({
  providedIn: 'root',
})
export class TidesService implements OnInit, OnDestroy {
  worldTidesApiKey = config.worldTidesApiKey;
  requestHeader = `https://www.worldtides.info/api/v2?heights&lat=-18.061&lon=122.369&key=${this.worldTidesApiKey}&stationDistance=100&step=60&length=1&start=`;
  tideHeight: number = 999999;
  // If there are problems with this, may need to reimplement it as a BehaviourSubject and hold an initial value of 0.0 or something.
  // private tideHeightObs$: Subject<number> = new Subject(); // start with default value of 0.0? Thats only for Behaviour Subjects.
  apiSubscription: Subscription;

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {}

  // getTideHeightObs(): Observable<number> {
  //   return this.tideHeightObs$.asObservable();
  // }

  // setTideHeightObs(tideHeight: number) {
  //   this.tideHeightObs$.next(tideHeight);
  // }

  getHeightFromDateTime(dateTime: number) {
    let response: Observable<any>;
    let request: string = this.requestHeader + dateTime.toString();
    console.log(
      'Calculations Service received datTime as:' + dateTime.toString()
    );

    // the pipe method filters out all other data and returns only the first height value.
    // Could change to get range of heights, or return JSON with tide station and other metadata and process later...
    this.apiSubscription = this.http
      .get<WorldTidesResponse>(request)
      .pipe(
        map((responseData) => {
          const height: number = responseData.heights[0].height;
          return height;
        })
      )
      .subscribe((result) => {
        console.log('From WorldTides:', result);
        this.store.dispatch(new TideActions.UpdateTideHeight(result));
      });

    console.log(request);
  }

  // TODO: also return station name that observation is from. Display to user.
  // getNearestTideStation() {}

  ngOnDestroy() {
    this.apiSubscription.unsubscribe();
  }
}
