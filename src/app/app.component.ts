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
    // Had to change sample-farms.geojson to farms.geojson... Was getting 400 error...
    this.map.data.loadGeoJson('http://localhost:4200/assets/farms.geojson', {}, 
    function (features: any) {
    console.log(features);
  });

  }
}
