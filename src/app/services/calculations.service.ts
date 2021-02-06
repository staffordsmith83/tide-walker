import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorldTidesResponse } from 'src/app/models/WorldTidesResponseModel';
import { resourceLimits } from 'worker_threads';

@Injectable({
  providedIn: 'root',
})
export class CalculationsService {
  // include methods to calculate tideHeight from day/time
  // TODO: also return station name that observation is from. Display to user.

  worldTidesApiKey = '3c2d3af9-c54c-42cf-8366-9cd62931d8d5';
  requestHeader =
    'https://www.worldtides.info/api/v2?heights&lat=-18.061&lon=122.369&key=3c2d3af9-c54c-42cf-8366-9cd62931d8d5&stationDistance=100&step=60&length=1&start=';
  tideHeight: number = 999999;

  constructor(private http: HttpClient) {}

  getNearestTideStation() {}

  getHeightFromDateTime(dateTime: number) {
   
    // Best solution, make tideHeight a subject, and subscribe to it in all components that need it.
    let tideHeight: number;
    let response: Observable<any>;
    let request: string = this.requestHeader + dateTime.toString();
    console.log(
      'Calculations Service received datTime as:' + dateTime.toString()
    );

    // the pipe method filters out all other data and returns only the first height value.
    // Could change to get range of heights, or return JSON with tide station and other metadata and process later...

    // NB: next block we return the observable. If we are going to use a Subject insted, get rid of the return keyword in the next line...
    // Also we would uncomment the .subscribe method.
    // So what we are doing here is returning the observable... so that we can then subscribe to it in external components!
    return this.http
      .get<WorldTidesResponse>(request)
      .pipe(
        map((responseData) => {
          const height: number = responseData.heights[0].height;
          return height;
        })
      )
      // .subscribe((result) => {
      //   console.log('From WorldTides:', result);
      //   this.tideHeight = result;
      // })
      ;

    console.log(request);
  }
}
