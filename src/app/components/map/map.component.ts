import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DOCUMENT } from '@angular/common';
import { TidesService } from 'src/app/services/tides.service';
import { Select, Store } from '@ngxs/store';
import { TideStateModel } from 'src/app/state/tide.state';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TideActions } from 'src/app/state/tide.actions';
import { MainActions } from 'src/app/state/main.actions';
import { LayersService } from 'src/app/services/layers.service';
import { MainStateModel } from 'src/app/state/main.state';
import U from 'mapbox-gl-utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  // An efficient way to unsubscribe to observables, used in conjunction with ngOnDestroy
  destroyed$ = new Subject<void>();

  // Set an initial tide height. But really we should just set this to the value of the tideHeight Subject in ngOnInit.
  unixTimestamp = this.store.selectSnapshot(
    (state) => (state.tide as TideStateModel).unixTimestamp
  );
  tideHeight: number = -5; // Set a default value but we should initialise a real value in ngOnInit using the current DateTime.
  geoServerRoot = environment.geoServerRoot;

  // nidemSourceLoaded: boolean = false;

  map: mapboxgl.Map | undefined;
  lat = -18.0707;
  lng = 122.38865;
  tilesLoaded = false;

  // Get access to the state:
  @Select((state) => (state.tide as TideStateModel).unixTimestamp)
  unixTimeStamp$: Observable<number>;
  @Select((state) => (state.tide as TideStateModel).tideHeight)
  tideHeight$: Observable<number>;
  @Select((state) => (state.tide as TideStateModel).tideWmsUrl)
  tideWmsUrl$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private tidesService: TidesService,
    private store: Store,
    private layersService: LayersService
  ) {}

  async ngOnInit() {
    // // Check if source is loaded
    // // TODO this may need to be setup as an observable...
    // this.nidemSourceLoaded = this.map?.isSourceLoaded('bathymetry-data') || false;

    // TODO: Should this be done somewhere else?
    // Get the initial tide height.
    this.tidesService.updateTideHeightFromApi(this.unixTimestamp);

    // Watch Tide Height - when it changes, update the wms.
    this.tideHeight$
      .pipe(
        tap((height) => {
          this.tideHeight = height;
          this.updateWms();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    // Watch the tidesWmsUrl for changes
    this.tideWmsUrl$
      .pipe(
        tap((tileUrl) => {
          this.updateWms();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    await this.initialiseMap();
    this.setupMapFunctionality();
  }

  async initialiseMap() {
    // Generate the WMS request in layersService and update the tiles url in the state
    // await this.layersService.generateTidesWmsUrl();

    //  Initialise the Map
    let location = this.store.selectSnapshot(
      (state) => (state.main as MainStateModel).location
    );
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
          nidem: {
            type: 'raster',
            tiles: [
              this.store.selectSnapshot(
                (state) => (state.tide as TideStateModel).tideWmsUrl
              ),
            ],
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

          {
            id: 'nidem_wms',
            type: 'raster',
            source: 'nidem',
            paint: {
              'raster-opacity': 0.7,
            },
          },
        ],
        // glyphs: 'http://localhost:4200/assets/fonts/{fontstack}/{range}.pbf',
      },
      zoom: 13,
      center: [location[1], location[0]],
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

    // Initialise Mapbox GL Utils library
    U.init(this.map);
  }

  setupMapFunctionality() {
    ////////////////////////////////////////////////////////////////////////////////////////
    // EVENT DRIVEN BEHAVIOURS

    this.map.on('moveend', () => {
      console.log('A moveend event occurred.');
      let center = this.map?.getCenter();
      if (center) {
        this.store.dispatch(
          new MainActions.UpdateLocation([center.lat, center.lng])
        );
      }
    });

    // Example of a MapDataEvent of type "sourcedata"
    this.map.on('sourcedata', (e) => {
      this.store.dispatch(new MainActions.UpdateMapLayersLoaded(e.isSourceLoaded));
    });

    this.map.on('idle', () => {
      this.store.dispatch(true);
    });


  }

  async updateWms() {
    /////////////////////////////////
    // RUN THIS SECTION WHEN OBSERVABLE CHANGES
    console.log('Changes detected trying to reload WMS');

    // Generate the WMS request in layersService and update the tiles url in the state
    let fullRequest = await this.layersService.generateTidesWmsUrl();

    // Check if the layer exists, if it does remove it
    if (this.layerExists('nidem_wms')) {
      this.map?.removeLayer('nidem_wms');
      this.map?.removeSource('nidem');
    }

    // Add the source
    this.map?.addSource('nidem', {
      type: 'raster',
      tiles: [fullRequest],
    });

    // Add the layer
    this.map?.addLayer({
      id: 'nidem_wms',
      type: 'raster',
      source: 'nidem',
      paint: {
        'raster-opacity': 0.7,
      },
    });
  }

  ngAfterViewInit() {
    // this.map?.setPaintProperty(
    //   'NIDEM',
    //   'raster-opacity',
    //   50
    // );
  }

  layerExists(layerName): boolean {
    if (this.map?.getLayer(layerName)) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    // update the destroyed$ Subject. This will cause all our observables to be unsubscribed
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

// Do stuff when we click on the map
// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
// map.on('click', 'poi', function (e) {
//   let coordinates = e.features[0].geometry.coordinates[0][0].slice();
//   let description = e.features[0].properties.description;

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
