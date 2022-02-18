// angular imports
// import { Time } from "@angular/common";
import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
// import * as moment from "moment";
import { TideActions } from "./tide.actions";

// the things we want control of

export interface TideMeasurement {
  dt: number,
  date: string,
  height: number,
}
export interface TideStateModel {
  date: Date,
  time: number,
  unixTimestamp: number,
  dateTimeReady: Boolean,
  tideHeight: number,
  tideStation: string,
  tideWmsUrl: string,
  legendGraphicUrl: string;
  tidesArray: TideMeasurement[],

};

// the default state of those things
const defaults: TideStateModel = {
  date: new Date(),
  time: new Date().getTime(),
  // unixTimestamp: moment(new Date()).unix(),
  unixTimestamp: Math.floor(Date.now() / 1000),
  dateTimeReady: true,
  tideHeight: 0.0,
  tideStation: 'Not Selected',
  tideWmsUrl: '',
  legendGraphicUrl: 'https://smithyserver.xyz/geoserver/wms?service=WMS&version=1.0.0&request=GetLegendGraphic&LAYER=tidewalker:NIDEM_mosaic&WIDTH=80&HEIGHT=40&FORMAT=image/png&transparent=TRUE&SLD_BODY=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0D%0A%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%0D%0Ahttp%3A%2F%2Fschemas.opengis.net%2Fsld%2F1.0.0%2FStyledLayerDescriptor.xsd%22%20version%3D%221.0.0%22%3E%0D%0A%20%20%3CNamedLayer%3E%0D%0A%20%20%20%20%3CName%3Etidewalker%3ANIDEM_mosaic%3C%2FName%3E%0D%0A%20%20%20%20%3CUserStyle%3E%0D%0A%20%20%20%20%20%20%3CTitle%3EA%20raster%20style%3C%2FTitle%3E%0D%0A%20%20%20%20%20%20%3CFeatureTypeStyle%3E%0D%0A%20%20%20%20%20%20%20%20%3CRule%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%3CRasterSymbolizer%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CColorMap%20type%3D%22intervals%22%20extended%3D%22true%22%3E%0D%0A%20%20%20%20%20%20%20%20%09%09%3CColorMapEntry%20color%3D%22%233e7ee6%22%20quantity%3D%220%22%20label%3D%22submerged%22%20opacity%3D%221%22%2F%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%09%3CColorMapEntry%20color%3D%22%23faf0a2%22%20quantity%3D%2250%22%20label%3D%22exposed%22%20opacity%3D%221%22%2F%3E%0D%0A%09%09%09%3C%2FColorMap%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%3C%2FRasterSymbolizer%3E%0D%0A%20%20%20%20%20%20%20%20%3C%2FRule%3E%0D%0A%20%20%20%20%20%20%3C%2FFeatureTypeStyle%3E%0D%0A%20%20%20%20%3C%2FUserStyle%3E%0D%0A%20%20%3C%2FNamedLayer%3E%0D%0A%3C%2FStyledLayerDescriptor%3E',
  tidesArray: [],

};

@State<TideStateModel>({
  name: "tide",
  defaults,
})

@Injectable()
export class TideState {
  @Action(TideActions.UpdateUnixTimestamp)
  updateUnixTimestamp({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateUnixTimestamp) {
    patchState({
      unixTimestamp: payload
    })
  }

  @Action(TideActions.UpdateTideHeight)
  updateTideHeight({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTideHeight) {
    patchState({
      tideHeight: payload
    })
  }

  @Action(TideActions.UpdateTideStation)
  updateTideStation({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTideStation) {
    patchState({
      tideStation: payload
    })
  }

  @Action(TideActions.UpdateTideWmsUrl)
  updateTideWmsUrl({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTideWmsUrl) {
    patchState({
      tideWmsUrl: payload
    })
  }

  @Action(TideActions.UpdateTideWmsLegendGraphicUrl)
  updateTideWmsLegendGraphicUrl({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTideWmsLegendGraphicUrl) {
    patchState({
      legendGraphicUrl: payload
    })
  }

  @Action(TideActions.UpdateTidesArray)
  updateTidesArray({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTidesArray) {
    patchState({
      tidesArray: payload
    })
  }

}
