import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Farm } from 'src/app/models/Farm';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // LOutput decorator to link to other modules
  @Output() farmsChanged = new EventEmitter<Farm[]>();

  map: google.maps.Map<Element> | undefined; // important to declare the type of property map, so we can refer to it with this.map
  
  // features: any; // Do I need this too?

  constructor() {}

  ngOnInit(): void {

  }

  onMapReady(map: google.maps.Map) {
    
    const farms: Farm[] = [];
    this.map = map;
    this.map.setCenter({ lat: -32.91, lng: 117.133 });
    this.map.setZoom(11);
    this.map.setMapTypeId('satellite');
    
    
    // Had to change sample-farms.geojson to farms.geojson... Was getting 400 error...
    this.map.data.loadGeoJson('http://localhost:4200/assets/farms.geojson', {}, 
    (features: google.maps.Data.Feature[]) => {
      const bbox = new google.maps.LatLngBounds();

        for (const feature of features) {
          const farmName = feature.getProperty("name");
          console.log(`this is a feature. name [${farmName}]`);
          // get the feature geometry, which is of type google.maps.Data.Geometry
          // then typecast it to a google maps data polygon,

          const polygon = feature.getGeometry() as google.maps.Data.Polygon;
          polygon.forEachLatLng(LatLng => {
            bbox.extend(LatLng);
          });

          farms.push({ farmName });
        }

        this.map?.fitBounds(bbox); // why the ?
        this.farmsChanged.emit(farms);
        
        // Style the polygons
        this.map?.data.setStyle({
          fillColor: "red",
          strokeWeight: 1
        });

      }
    );
  }
}
