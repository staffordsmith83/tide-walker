import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { TideActions } from "../state/tide.actions";
import { TideStateModel } from "../state/tide.state";
import { TidesService } from "./tides.service";

@Injectable({
    providedIn: 'root',
})
export class LayersService {

    // Set an initial tide height. But really we should just set this to the value of the tideHeight Subject in ngOnInit.
    unixTimestamp = this.store.selectSnapshot(state => (state.tide as TideStateModel).unixTimestamp);
    tideHeight: number = -5;    // Set a default value but we should initialise a real value in ngOnInit using the current DateTime.
    geoServerRoot = environment.geoServerRoot


    constructor(private tidesService: TidesService, private store: Store) {

    }

    styleConstructor(tideHeight: number) {
        // insert the tideHeight into the following string, which is a full sld style file as a string

        let sldXmlTemplate: string = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<StyledLayerDescriptor xmlns=\"http:\/\/www.opengis.net\/sld\" xmlns:ogc=\"http:\/\/www.opengis.net\/ogc\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xsi:schemaLocation=\"http:\/\/www.opengis.net\/sld\r\nhttp:\/\/schemas.opengis.net\/sld\/1.0.0\/StyledLayerDescriptor.xsd\" version=\"1.0.0\">\r\n  <NamedLayer>\r\n    <Name>tidewalker:NIDEM_mosaic<\/Name>\r\n    <UserStyle>\r\n      <Title>A raster style<\/Title>\r\n      <FeatureTypeStyle>\r\n        <Rule>\r\n          <RasterSymbolizer>\r\n            <ColorMap type=\"intervals\" extended=\"true\">\r\n        \t\t<ColorMapEntry color=\"#3e7ee6\" quantity=\"${tideHeight}\" label=\"submerged\" opacity=\"1\"\/>\r\n              \t<ColorMapEntry color=\"#faf0a2\" quantity=\"50\" label=\"exposed\" opacity=\"1\"\/>\r\n\t\t\t<\/ColorMap>\r\n          <\/RasterSymbolizer>\r\n        <\/Rule>\r\n      <\/FeatureTypeStyle>\r\n    <\/UserStyle>\r\n  <\/NamedLayer>\r\n<\/StyledLayerDescriptor>`;
        

        // encode the sld to be passed as a url, use encodeURIComponent to encode the ? characters especially
        let encodedStyle = encodeURIComponent(sldXmlTemplate);

        return encodedStyle;
    }

    generateTidesWmsUrl() {
        // refresh the intertidal zone submergence WMS
        const dateTime = this.store.selectSnapshot(state => (state.tide as TideStateModel).unixTimestamp);
        this.tidesService.updateTideHeightFromApi(dateTime);
        let tideHeight = this.store.selectSnapshot(state => (state.tide as TideStateModel).tideHeight);

        let getMapRequest: string =
            `${this.geoServerRoot}/wms?service=WMS&version=1.1.0&request=GetMap&LAYERS=tidewalker:NIDEM_mosaic&SRS=epsg:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&transparent=TRUE`;
        // `${this.geoServerRoot}/wms?service=WMS&version=1.3.0&request=GetMap&LAYERS=NIDEM&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&transparent=TRUE`;
        let sld_style: string = this.styleConstructor(tideHeight);
        let fullRequest: string = getMapRequest + '&STYLE_BODY=' + sld_style;
        console.log(fullRequest);
        this.store.dispatch(new TideActions.UpdateTideWmsUrl(fullRequest))

        return fullRequest

        }

}