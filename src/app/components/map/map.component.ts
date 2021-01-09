// TODO: Have button to start amazon ec2 instance so that geoserver becomes accessible! Is that a good idea?
// Not really aapropriate for end users... But good for my testing app! Show server status, and have start and stop buttons.
// https://ajahne.github.io/blog/javascript/aws/2019/06/21/launch-stop-terminate-aws-ec2-instance-nodejs.html

import { environment } from '../../../environments/environment';
import { Input, Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, DebugEventListener } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DOCUMENT } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';

import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { debug } from 'console';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // Output decorator to link to other modules
  // @Output() poiChanged = new EventEmitter<Farm[]>();


  // THIS PART NOT WORKING - it messe up the geoserver request.
  @Input() tideHeight = "-5";
  // tideHeight = "0";

  map: mapboxgl.Map | undefined;
  lat = -18.0707;
  lng = 122.26865;
  fullRequest = "";
  
  constructor(@Inject(DOCUMENT) private document: Document) {}

  styleConstructor(tideHeight: string) {
    // insert the tideHeight into the following string, which is a full sld style file as a string
    // important to escape this to put in string.
    // important to put full workspace:layer name in the name tag of the sld xml!
    console.log("Map component thinks thide height is " + this.tideHeight);
    // debug;
    let sldXmlTemplate: string = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<StyledLayerDescriptor xmlns=\"http:\/\/www.opengis.net\/sld\" xmlns:ogc=\"http:\/\/www.opengis.net\/ogc\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xsi:schemaLocation=\"http:\/\/www.opengis.net\/sld\r\nhttp:\/\/schemas.opengis.net\/sld\/1.0.0\/StyledLayerDescriptor.xsd\" version=\"1.0.0\">\r\n  <NamedLayer>\r\n    <Name>NIDEM:NIDEM_mosaic<\/Name>\r\n    <UserStyle>\r\n      <Title>A raster style<\/Title>\r\n      <FeatureTypeStyle>\r\n        <Rule>\r\n          <RasterSymbolizer>\r\n            <ColorMap type=\"intervals\" extended=\"true\">\r\n        \t\t<ColorMapEntry color=\"#3e7ee6\" quantity=\"${tideHeight}\" label=\"submerged\" opacity=\"1\"\/>\r\n              \t<ColorMapEntry color=\"#faf0a2\" quantity=\"50\" label=\"exposed\" opacity=\"1\"\/>\r\n\t\t\t<\/ColorMap>\r\n          <\/RasterSymbolizer>\r\n        <\/Rule>\r\n      <\/FeatureTypeStyle>\r\n    <\/UserStyle>\r\n  <\/NamedLayer>\r\n<\/StyledLayerDescriptor>`;
    // let sldXmlTemplate: string = `<ColorMap type=\"intervals\" extended=\"true\">\r\n<ColorMapEntry color=\"#3e7ee6\" quantity=\"${tideHeight}\" label=\"submerged\" opacity=\"1\"\/>\r\n<ColorMapEntry color=\"#faf0a2\" quantity=\"50\" label=\"exposed\" opacity=\"0.5\"\/>\r\n<\/ColorMap>`;
    
    // encode the sld to be passed as a url, use encodeURIComponent to encode the ? characters especially
    let encodedStyle = encodeURIComponent(sldXmlTemplate);
    
    return encodedStyle;
  }

  ngOnInit() {
    // mapboxgl.accessToken = environment.mapbox.accessToken;

  
    let map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              // "http://tile.stamen.com/toner/{z}/{x}/{y}.png",
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
        glyphs: 'http://localhost:4200/assets/fonts/{fontstack}/{range}.pbf',
      },
      zoom: 11,
      center: [this.lng, this.lat],
    });

    // Add map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    ////////////////////////////////////////////////////////////////////////////////////////
    // EVENT DRIVEN BEHAVIOURS

    // Add the NIDEM WMS layer
    map.on('load', () => {
      let getMapRequest: string =
        'http://ec2-13-55-247-227.ap-southeast-2.compute.amazonaws.com:8080/geoserver/NIDEM/wms?service=WMS&version=1.1.0&request=GetMap&LAYERS=NIDEM_mosaic&SRS=epsg:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&transparent=TRUE';
      let sld_style: string = this.styleConstructor(this.tideHeight);
      let fullRequest: string = getMapRequest + '&STYLE_BODY=' + sld_style;
      // console.log(fullRequest);

      map.addSource('nidem', {
        type: 'raster',
        tiles: [fullRequest],
      });

      map.addLayer({
        id: 'nidem_wms',
        type: 'raster',
        source: 'nidem',
        paint: {},
      });

      map.loadImage(
        'http://localhost:4200/assets/icons/footprint1.png',
        function (error: any, image: any) {
          if (error) throw error;
          map.addImage('footprint', image);

          // add some dummy point locations
          map.addSource('points', {
            type: 'geojson',
            data: 'http://localhost:4200/assets/footprintsWGS84.geojson',
          });

          // Add a symbol layer
          map.addLayer({
            id: 'poi',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'footprint',
              // get the title name from the source's "group" property
              'text-field': ['get', 'group'],
              'text-font': ['Open Sans Semibold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#000000',
            },
          });
        }
      );
    });

    // show the coordinates at the mousepoint
    map.on('mousemove', (e) => {
      this.document.getElementById('info').innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        JSON.stringify(e.point) +
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat.wrap());
    });
  }
}

    // Do stuff when we click on the map
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    // map.on('click', 'poi', function (e) {
    //   var coordinates = e.features[0].geometry.coordinates[0][0].slice();
    //   var description = e.features[0].properties.description;

    //   // Ensure that if the map is zoomed out such that multiple
    //   // copies of the feature are visible, the popup appears
    //   // over the copy being pointed to.
    //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //   }

    //   new mapboxgl.Popup()
    //   .setLngLat(coordinates)
    //   .setHTML(description)
    //   .addTo(map);
    //   });

    //   // Change the cursor to a pointer when the mouse is over the places layer.
    //   map.on('mouseenter', 'places', function () {
    //   map.getCanvas().style.cursor = 'pointer';
    //   });

    //   // Change it back to a pointer when it leaves.
    //   map.on('mouseleave', 'places', function () {
    //   map.getCanvas().style.cursor = '';
    //   });

// NEXT, get each of the loaded features, add the names to a list, and emit them so they are available to other components
// Modify this
// Loop through each feature
//         for (const feature of features) {
//           const farmName = feature.getProperty('name');
//           // get the feature geometry, which is of type google.maps.Data.Geometry
//           // then typecast it to a google maps data polygon,
//           // const polygon = feature.getGeometry() as google.maps.Data.Polygon;
//           // THIS DIDNT SEEM TO BE NECESSARY, AND LETS US DEAL WITH ALL SHAPE TYPES?
//           const geometry = feature.getGeometry();
//           geometry.forEachLatLng((LatLng) => {
//             bbox.extend(LatLng);
//           });

//           farms.push({ farmName });
//           console.log(farmName);
//         }

//         this.map?.fitBounds(bbox); // why the ?
//         this.farmsChanged.emit(farms);

// /* TODO:
// Get feature name and other attributes from the user, like in ArcGIS
// Use the new attribute-form component, to let users enter a full range of attributes
// The attribute field list should be extracted fromt he layer you are currently editing
// And the form dynamically built
// */

// import { GoogleMapsAPIWrapper } from '@agm/core';
// import { MVCArray } from '@agm/core/services/google-maps-types';
// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// // import { debug } from 'console';
// import { Farm } from 'src/app/models/Farm';

// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss'],
// })
// export class MapComponent implements OnInit {
//   // Output decorator to link to other modules
//   @Output() farmsChanged = new EventEmitter<Farm[]>();

//   // Declare types
//   map: google.maps.Map<Element> | undefined; // important to declare the type of property map, so we can refer to it with this.map
//   drawingManager: google.maps.drawing.DrawingManager | undefined;

//   // Constructor method. Not used...
//   constructor() {}

//   // Angular built in that runs after everything else I think
//   ngOnInit(): void {}

//   // This executes after the google map is fully initialised
//   // Called by map.component.html when the (mapReady) event is emitted
//   onMapReady(map: google.maps.Map) {
//     const farms: Farm[] = [];
//     this.map = map;
//     this.map.setCenter({ lat: -32.91, lng: 117.133 });
//     this.map.setZoom(11);
//     this.map.setMapTypeId('satellite');

//     // Load the geojson and do stuff with the callback function
//     // The callback function is invoked after all features are loaded, and has the features as a parameter
//     this.map.data.loadGeoJson(
//       'http://localhost:4200/assets/farms.geojson',
//       {}, //options go here
//       (features: google.maps.Data.Feature[]) => {
//         const bbox = new google.maps.LatLngBounds();

//         // Loop through each feature
//         for (const feature of features) {
//           const farmName = feature.getProperty('name');
//           // get the feature geometry, which is of type google.maps.Data.Geometry
//           // then typecast it to a google maps data polygon,
//           // const polygon = feature.getGeometry() as google.maps.Data.Polygon;
//           // THIS DIDNT SEEM TO BE NECESSARY, AND LETS US DEAL WITH ALL SHAPE TYPES?
//           const geometry = feature.getGeometry();
//           geometry.forEachLatLng((LatLng) => {
//             bbox.extend(LatLng);
//           });

//           farms.push({ farmName });
//           console.log(farmName);
//         }

//         this.map?.fitBounds(bbox); // why the ?
//         this.farmsChanged.emit(farms);

//         // Style the polygons
//         this.map?.data.setStyle({
//           fillColor: 'red',
//           strokeWeight: 1,
//         });
//       }
//     );

//     // Setup the drawing manager
//     this.drawingManager = new google.maps.drawing.DrawingManager({
//       drawingControlOptions: {
//         position: google.maps.ControlPosition.TOP_LEFT,
//         drawingModes: [
//           google.maps.drawing.OverlayType.MARKER,
//           google.maps.drawing.OverlayType.POLYLINE,
//           google.maps.drawing.OverlayType.POLYGON,
//         ],
//       }
//     });
//     this.drawingManager.setMap(map); //set the drawing manager to operate on our map object

//     // Setup the actions to perform after shapes are finished
//     google.maps.event.addListener(
//       this.drawingManager,
//       'overlaycomplete',
//       (event) => {

//         // remove overlay from the map
//         event.overlay.setMap(null);

//         // disable drawing manager
//         this.drawingManager?.setDrawingMode(null);

//         // Get feature name from user
//         const featureName: string = prompt('What is the name of the feature?');

//         // Setup the variables that we need to scope both inside and ouside out case statements
//         let feature: google.maps.Data.Feature;
//         let geom: google.maps.Data.Geometry | undefined;  // this is the parent class of Point, Linestring, and Polygon

//         // Build a different google maps data object depending on the type of drawing we made
//         switch (event.type) {
//           case google.maps.drawing.OverlayType.MARKER:
//             geom = new google.maps.Data.Point(event.overlay.getPosition());
//           break;

//           case google.maps.drawing.OverlayType.POLYLINE:
//             geom = new google.maps.Data.LineString(event.overlay.getPath().getArray());
//           break;

//           case google.maps.drawing.OverlayType.POLYGON:
//             geom = new google.maps.Data.Polygon([event.overlay.getPath().getArray()]);
//           break;

//         }

//         // Build the feature and add to the map and TOC as long as we have one of the valid geometries
//         if (geom) {
//           // Build the feature
//           feature = new google.maps.Data.Feature({
//             geometry: geom,
//             properties: {
//               name: featureName
//             }
//           })

//           // Add it to the map
//           this.map?.data.add(feature);

//           // push the farm name to our list of feature names, which will be dynamically reflected in the sidebar component
//           const farmName = feature.getProperty('name');
//           farms.push({ farmName });

//         } else {
//           console.log("Not a valid feature, not adding to TOC.")
//         }
//       }
//     );
//   }
// }
