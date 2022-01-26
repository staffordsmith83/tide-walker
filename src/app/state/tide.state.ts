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
  tidesArray: TideMeasurement[],

};

// the default state of those things
const defaults: TideStateModel = {
  date: new Date(),
  time: new Date().getTime(),
  // unixTimestamp: moment(new Date()).unix(),
  unixTimestamp: 1633173805,
  dateTimeReady: true,
  tideHeight: 0.0,
  tideStation: 'Not Selected',
  tideWmsUrl: '',
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
  
  @Action(TideActions.UpdateTidesArray)
  updateTidesArray({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateTidesArray) {
    patchState({
      tidesArray: payload
    })
  }

}
