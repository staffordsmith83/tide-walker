// angular imports
import { Time } from "@angular/common";
import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import * as moment from "moment";
import { TideActions } from "./Tide.actions";

// the things we want control of
export interface TideStateModel {
  date: Date,
  time: number,
  unixTimestamp: number,
  dateTimeReady: Boolean

};

// the default state of those things
const defaults: TideStateModel = {
  date: new Date(),
  time: new Date().getTime(),
  // unixTimestamp: moment(new Date()).unix(),
  unixTimestamp: 1633173805,
  dateTimeReady: true

};

@State<TideStateModel>({
  name: "tide",
  defaults,
})

@Injectable()
export class TideState {
  @Action(TideActions.UpdateUnixTimestamp)
  openSideBar({ patchState }: StateContext<TideStateModel>, { payload }: TideActions.UpdateUnixTimestamp) {
    patchState({
      unixTimestamp: payload
    })
  }

}
