import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

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

  getNearestTideStation() {
  }

  getHeightFromDateTime(dateTime: number) {
    let tideHeight: number;
    let response: Observable<any>;
    let request: string = this.requestHeader + dateTime.toString();
    console.log("Calculations Service received datTime as:" + dateTime.toString())


    this.http
      .get<any>(request)
      .subscribe((result) => {
        console.log('From WorldTides:', result.heights[0].height);
      });

    console.log(request);

  }

  

}
