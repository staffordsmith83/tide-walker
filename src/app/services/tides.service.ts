import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorldTidesResponse } from 'src/app/models/WorldTidesResponseModel';
import { config } from '../configs/config';
import { MainStateModel } from '../state/main.state';
import { TideActions } from '../state/tide.actions';
import { TideStateModel } from '../state/tide.state';
import { Worldtides } from './deno_worldtides';

@Injectable({
  providedIn: 'root',
})
export class TidesService implements OnInit, OnDestroy {
  worldTidesApiKey = config.worldTidesApiKey;

  // New way using Deno_Worldtides wrapper
  worldtides = new Worldtides({
    key: config.worldTidesApiKey,
  });

  requestHeader = `https://www.worldtides.info/api/v2?heights&key=${this.worldTidesApiKey}&stationDistance=100&step=60&length=1&start=`;
  tideHeight: number = 999999;
  // If there are problems with this, may need to reimplement it as a BehaviourSubject and hold an initial value of 0.0 or something.
  // private tideHeightObs$: Subject<number> = new Subject(); // start with default value of 0.0? Thats only for Behaviour Subjects.
  apiSubscription: Subscription;

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {}


  // This function below no longer used. Instead we fetch an array of tides for an entire day
  updateTideHeightFromApi(dateTime: number) {
    console.log('skipping updateTideHeightFromApi() function');
      // TODO: Update the location each time?

      let location = this.store.selectSnapshot(state => (state.main as MainStateModel).location);

      let response: Observable<any>;
      let request: string = `${this.requestHeader}${dateTime.toString()}&lat=${location[0]}&lon=${location[1]}`;
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
            const station: string = responseData.station;
            return { height, station };
          })
        )
        .subscribe((result) => {
          console.log('From WorldTides:', result);
          // this.store.dispatch(new TideActions.UpdateTideHeight(result.height));
          this.store.dispatch(new TideActions.UpdateTideStation(result.station));
        });

      console.log(request);
  }

  async getDailyTidesArray() {
    let location = this.store.selectSnapshot(
      (state) => (state.main as MainStateModel).location
    );
    let unixTimeStamp = this.store.selectSnapshot(
      (state) => (state.tide as TideStateModel).unixTimestamp
    );
    let date = new Date(unixTimeStamp * 1000);

    const result = await this.worldtides.request({
      lat: location[0],
      lon: location[1],
      heights: true,
      // date: date,  // Perhaps go back to using this, but was advancing one day forward than what I wanted...
      start: unixTimeStamp,
      days: 1,
      localtime: true,
    });

    console.log(result);
    return result.heights;
  }

  async updateTidesArray() {
    let data = await this.getDailyTidesArray(); // get the tides array data
    this.store.dispatch(new TideActions.UpdateTidesArray(data));
  }

  updateDisplayHeightAndWmsFromArray() {
    let tidesArray = this.store.selectSnapshot((state) => (state.tide as TideStateModel).tidesArray);
    this.store.dispatch(new TideActions.UpdateTideHeight(this._getMinHeight(tidesArray)));
  }

  updateDisplayHeightAndWmsFromChart(tideHeight: number)
  {
    this.store.dispatch(new TideActions.UpdateTideHeight(tideHeight));
  }


  // helper functions to get minimum and maximum objects from tide array
  // TODO: Should return the whole object, not just the height value
  _getHeights(data){
    return data.map(d => d.height);
  }
  _getMinHeight(data){
    return Math.min(...this._getHeights(data));
  }
  _getMaxHeight(data){
    return Math.max(...this._getHeights(data));
  }


  ngOnDestroy() {
    this.apiSubscription.unsubscribe();
  }
}
