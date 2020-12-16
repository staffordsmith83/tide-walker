import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'simple-gmaps-demo';

  map: any; // important to declare the type of property map, so we can refer to it with this.map
  features: any;  // Do I need this too?
  

  onMapReady(map: google.maps.Map) {

    this.map = map;
    this.map.setCenter({lat:-32.910, lng:117.133});
    this.map.setZoom(10); 

    // Error in this method call?
    // features seems to be a strange format... We want an iterable 1D array, 
    // where there is an element for each geoJson feature, and each element has accessible properties
    // need to be able to access the name using feature.name
    // Browser console suggests its read in in a weird


    // Had to change sample-farms.geojson to farms.geojson... Was getting 400 error...

    // Old method call using thick arrow notation:
    this.map.data.loadGeoJson('http://localhost:4200/assets/farms.geojson', {}, 
    (features: google.maps.Data.Feature[]) => {
      console.log(features);
    });

  }
}
