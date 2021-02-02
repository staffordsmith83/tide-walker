import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculationsService implements OnInit {

  // include methods to calculate tideHeight from day/time
  worldTidesApiKey = '3c2d3af9-c54c-42cf-8366-9cd62931d8d5';
  requestHeader =
    'https://www.worldtides.info/api/v2?heights&lat=33.768321&lon=-118.195617&key=3c2d3af9-c54c-42cf-8366-9cd62931d8d5&step=60&length=1&start=';
  tideHeight: number = 999999;
  
  // constructor(private http: HttpClient) {}

  
//   getHeightFromDateTime(dateTime: number) {
//     let tideHeight: number;
//     let response: Observable<any>;
//     let request: string = this.requestHeader + dateTime.toString;
//     console.log(request);

//     // return this.http.get<any>(request).subscribe((data) => {
//     // //   console.log(data.heights[0].height);
//     //   this.tideHeight = data.heights[0].height;
//     //   console.log(this.tideHeight);
//     //   return this.tideHeight;

//     this.tideHeightSubscription = this.http.get<any>(request).subscribe((data) => {
//         this.tideHeight = data.heights[0].height;
//         console.log(this.tideHeight);
//         return this.tideHeight;;
//   });
// }

  ngOnInit() {
    //MAKE A CUSTOM OBSERVABLE from scratch
    // let epochTime = 1612166015;
    const tideHeightObservable = of(1.0, 2.0, 3.0);

    const tideObserver = {
      next: x => console.log('Tide height got updated value of: ' + x),
      error: err => console.error('Error'),
      complete: () => console.log('Complete')
    };

    tideHeightObservable.subscribe(tideObserver);
    

    // // The subscribe method takes data and
    // this.tideHeightSubscription = tideHeightObservable.subscribe((data: number) => {
    //   console.log(data);
    // });
  }
}
