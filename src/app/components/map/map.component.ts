import { GoogleMapsAPIWrapper } from '@agm/core';
import { MVCArray } from '@agm/core/services/google-maps-types';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { debug } from 'console';
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

    // Load the geojson and do stuff with the callback function
    // The callback function is invoked after all features are loaded, and has the features as a parameter
    this.map.data.loadGeoJson(
      'http://localhost:4200/assets/farms.geojson',
      {}, //options go here
      (features: google.maps.Data.Feature[]) => {
        const bbox = new google.maps.LatLngBounds();

        // Loop through each feature
        for (const feature of features) {
          const farmName = feature.getProperty('name');
          // get the feature geometry, which is of type google.maps.Data.Geometry
          // then typecast it to a google maps data polygon,
          // const polygon = feature.getGeometry() as google.maps.Data.Polygon;
          const polygon = feature.getGeometry();
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
        // remove overlay from the map
        event.overlay.setMap(null);

        // disable drawing manager
        this.drawingManager?.setDrawingMode(null);

        // Get feature name from user
        // TODO: use the new attribute-form component, to let users enter a full range of attributes
        // The attribute field list should be extracted fromt he layer you are currently editing
        // And the form dynamically built.
        const featureName: string = prompt('What is the name of the feature?');

        // convert polygon to maps.data.feature and add it to map.data
        const feature = new google.maps.Data.Feature({
          geometry: new google.maps.Data.Polygon([
            event.overlay.getPath().getArray(),
          ]),
          properties: {
            name: featureName,
          },
        });
        this.map?.data.add(feature);

        // push the farm name to our list of feature names
        const farmName = feature.getProperty('name');
        farms.push({ farmName });

        // google.maps.event.trigger(map, 'resize');

        // TODO: Get feature name and other attributes from the user, like in ArcGIS

        // TODO: push the feature name to the list for the TOC

        // farms.push({
        //   farmName: farmName
        // });
      }
    );
  }
}
