import { MVCArray } from '@agm/core/services/google-maps-types';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Farm } from 'src/app/models/Farm';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // Output decorator to link to other modules
  @Output() farmsChanged = new EventEmitter<Farm[]>();

  // Declare types
  map: google.maps.Map<Element> | undefined; // important to declare the type of property map, so we can refer to it with this.map
  drawingManager: google.maps.drawing.DrawingManager | undefined;
  
  // Constructor method. Not used...
  constructor() {}

  // Angular built in that runs after everything else I think
  ngOnInit(): void {}

  // This executes after the google map is fully initialised
  // Called by map.component.html when the (mapReady) event is emitted
  onMapReady(map: google.maps.Map) {
    const farms: Farm[] = [];
    this.map = map;
    this.map.setCenter({ lat: -32.91, lng: 117.133 });
    this.map.setZoom(11);
    this.map.setMapTypeId('satellite');

    // Had to change sample-farms.geojson to farms.geojson... Was getting 400 error...
    this.map.data.loadGeoJson(
      'http://localhost:4200/assets/farms.geojson',
      {},
      (features: google.maps.Data.Feature[]) => {
        const bbox = new google.maps.LatLngBounds();

        for (const feature of features) {
          const farmName = feature.getProperty('name');
          console.log(`this is a feature. name [${farmName}]`);
          // get the feature geometry, which is of type google.maps.Data.Geometry
          // then typecast it to a google maps data polygon,
          const polygon = feature.getGeometry() as google.maps.Data.Polygon;
          polygon.forEachLatLng((LatLng) => {
            bbox.extend(LatLng);
          });

          farms.push({ farmName });
          console.log(farmName);
        }

        this.map?.fitBounds(bbox); // why the ?
        this.farmsChanged.emit(farms);

        // Style the polygons
        this.map?.data.setStyle({
          fillColor: 'red',
          strokeWeight: 1,
        });
      }
    );

    // Setup the drawing manager
    this.drawingManager = new google.maps.drawing.DrawingManager();
    this.drawingManager.setMap(map); //set the drawing manager to operate on our this.map object

    // Setup the actions to perform after shapes are finished
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        
        // get overlay paths
        const path = event.overlay.getPaths();

        // remove overlay from the map
        event.overlay.setMap(null);

        // disable drawing manager
        try {
          this.drawingManager.setDrawingMode(null);
        } catch (error) {
          
        }
        
        // create a polygon object from the path
        var polygon = new google.maps.Polygon({
          fillColor: 'red',
          strokeWeight: 1,
          editable: false,
          draggable: true,
          paths: path,
          map: map
        });

      
      // TODO: Get feature name and other attributes from the user, like in ArcGIS


      // TODO: push the feature name to the list for the TOC

        // farms.push({
        //   farmName: farmName
        // });
      });
    }


  }

