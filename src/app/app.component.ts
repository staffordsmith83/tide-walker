import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'simple-gmaps-demo';
  // lat = 51.678418;
  // lng = 7.809007;
  map: any; // important to declare the type of property map, so we can refer to it with this.map
  features: any;
  

  onMapReady(map: google.maps.Map) {

    this.map = map;
    this.map.setCenter({lat:-32, lng:127});
    this.map.setZoom(10);
   
    //need to define the type of features?
    // let features: any; //doesnt work like this...

    this.map.data.loadGeoJson('http://localhost:4200/assets/sample-farms.geojson', {}, 
      function (features: any) {
      console.log(features);
    });

  }
}