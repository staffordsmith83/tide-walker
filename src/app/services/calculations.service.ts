import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculationsService {
  // include methods to calculate tideHeight from day/time
  worldTidesApiKey = '3c2d3af9-c54c-42cf-8366-9cd62931d8d5';
  requestHeader =
    'https://www.worldtides.info/api/v2?heights&lat=33.768321&lon=-118.195617&key=3c2d3af9-c54c-42cf-8366-9cd62931d8d5&step=60&length=1&start=';
  tideHeight: number = 999999;

  constructor(private http: HttpClient) {}

  getHeightFromDateTime(dateTime: number) {
    let tideHeight: number;
    let response: Observable<any>;
    let request: string = this.requestHeader + dateTime.toString;


    let data = this.http
      .get<any>(request)
      .toPromise()
      .then((result) => {
        console.log('From Promise:', result.heights[0].height);
        return result.heights[0].height;
      });

  }

}
