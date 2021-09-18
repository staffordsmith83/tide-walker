import { Component, OnInit, Inject } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DOCUMENT } from '@angular/common';
import { TidesService } from 'src/app/services/tides.service';
import { defaults } from 'src/app/config';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // Set an initial tide height. But really we should just set this to the value of the tideHeight Subject in ngOnInit.
  tideHeight = '-5';
  geoServerRoot = defaults.geoServerRoot;

  map: mapboxgl.Map | undefined;
  lat = -18.0707;
  lng = 122.26865;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private tidesService: TidesService
  ) { }

  ngOnInit() {
    // subscribe to tideHeightObs Subject
    this.tidesService.getTideHeightObs().subscribe((tideHeight) => {
      this.tideHeight = tideHeight.toString();
      this.updateWms();
    });
    this.initialiseMap();
    this.setupMapFunctionality();
  }

  initialiseMap() {
    //  Initialise the Map
    this.map = new mapboxgl.Map({
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
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
  }

  setupMapFunctionality() {
    ////////////////////////////////////////////////////////////////////////////////////////
    // EVENT DRIVEN BEHAVIOURS

    // Add the NIDEM WMS layer
    this.map?.on('load', () => {
      let getMapRequest: string =
        `http://${this.geoServerRoot}/NIDEM/wms?service=WMS&version=1.1.0&request=GetMap&LAYERS=NIDEM_mosaic&SRS=epsg:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&transparent=TRUE`;
      let sld_style: string = this.styleConstructor(this.tideHeight);
      let fullRequest: string = getMapRequest + '&STYLE_BODY=' + sld_style;
      console.log(fullRequest);

      this.map?.addSource('nidem', {
        type: 'raster',
        tiles: [fullRequest],
      });

      this.map?.addLayer({
        id: 'nidem_wms',
        type: 'raster',
        source: 'nidem',
        paint: {},
      });

      // Add the legend
      this.map?.addSource('nidemLegend', {
        type: 'image',
        url:
          `http://${this.geoServerRoot}/NIDEM/wms?service=WMS&version=1.0.0&request=GetLegendGraphic&LAYER=NIDEM_mosaic&WIDTH=20&HEIGHT=20&FORMAT=image/png`,
        coordinates: [
          [-80.425, 46.437],
          [-71.516, 46.437],
          [-71.516, 37.936],
          [-80.425, 37.936],
        ],
      });

      // ADD POINT DATA SECTION -
      this.map?.loadImage(
        'http://localhost:4200/assets/icons/footprint1.png',
        (error: any, image: any) => {
          if (error) throw error;
          this.map?.addImage('footprint', image);
        }
      );

      // add some dummy point locations
      this.map?.addSource('points', {
        type: 'geojson',
        data: 'http://localhost:4200/assets/footprintsWGS84.geojson',
      });

      // Add a symbol layer
      this.map?.addLayer({
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
    });

    //////////////////////////////////////////////
    // show the coordinates at the mousepoint, store it in a HTML element accessible to other components.
    // TODO: Is there another Angularistic way to do this
    this.map?.on('mousemove', (e) => {
      this.document.getElementById('info').innerHTML =
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify("Lat: " + e.lngLat.lat.toFixed(4) + " Lng:" + e.lngLat.lng.toFixed(4));
    });
  }

  styleConstructor(tideHeight: string) {
    // insert the tideHeight into the following string, which is a full sld style file as a string
    // important to put full workspace:layer name in the name tag of the sld xml!
    console.log('Map component thinks thide height is ' + this.tideHeight);
    let sldXmlTemplate: string = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<StyledLayerDescriptor xmlns=\"http:\/\/www.opengis.net\/sld\" xmlns:ogc=\"http:\/\/www.opengis.net\/ogc\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xsi:schemaLocation=\"http:\/\/www.opengis.net\/sld\r\nhttp:\/\/schemas.opengis.net\/sld\/1.0.0\/StyledLayerDescriptor.xsd\" version=\"1.0.0\">\r\n  <NamedLayer>\r\n    <Name>NIDEM:NIDEM_mosaic<\/Name>\r\n    <UserStyle>\r\n      <Title>A raster style<\/Title>\r\n      <FeatureTypeStyle>\r\n        <Rule>\r\n          <RasterSymbolizer>\r\n            <ColorMap type=\"intervals\" extended=\"true\">\r\n        \t\t<ColorMapEntry color=\"#3e7ee6\" quantity=\"${tideHeight}\" label=\"submerged\" opacity=\"1\"\/>\r\n              \t<ColorMapEntry color=\"#faf0a2\" quantity=\"50\" label=\"exposed\" opacity=\"1\"\/>\r\n\t\t\t<\/ColorMap>\r\n          <\/RasterSymbolizer>\r\n        <\/Rule>\r\n      <\/FeatureTypeStyle>\r\n    <\/UserStyle>\r\n  <\/NamedLayer>\r\n<\/StyledLayerDescriptor>`;

    // encode the sld to be passed as a url, use encodeURIComponent to encode the ? characters especially
    let encodedStyle = encodeURIComponent(sldXmlTemplate);

    return encodedStyle;
  }

  updateWms() {
    /////////////////////////////////
    // RUN THIS SECTION WHEN OBSERVABLE CHANGES
    console.log('Changes detected trying to reload WMS');

    let getMapRequest: string =
      `http://${this.geoServerRoot}/NIDEM/wms?service=WMS&version=1.1.0&request=GetMap&LAYERS=NIDEM_mosaic&SRS=epsg:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&transparent=TRUE`;
    let sld_style: string = this.styleConstructor(this.tideHeight);
    let fullRequest: string = getMapRequest + '&STYLE_BODY=' + sld_style;
    console.log(fullRequest);

    this.map?.removeLayer('nidem_wms');
    this.map?.removeSource('nidem');

    this.map?.addSource('nidem', {
      type: 'raster',
      tiles: [fullRequest],
    });

    this.map?.addLayer({
      id: 'nidem_wms',
      type: 'raster',
      source: 'nidem',
      paint: {},
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
