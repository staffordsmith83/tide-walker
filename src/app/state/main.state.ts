// angular imports
import { Injectable } from "@angular/core";

// third party imports
import { State, Action, StateContext } from "@ngxs/store";

// app imports
import { MainActions } from "./main.actions";


////////////////////////////////////////////////////////////////////////////////

// the things we want control of
export interface MainStateModel {
  sideBarOpen: boolean;
  location: [number, number];
  mapLayersLoaded: boolean;
};

// the default state of those things
const defaults: MainStateModel = {
  sideBarOpen: true,
  location: [-17.9618, 122.27],
  mapLayersLoaded: false,
};

@State<MainStateModel>({
  name: "main",
  defaults,
})

@Injectable()
export class MainState {
  @Action(MainActions.OpenSideBar)
  openSideBar({ patchState }: StateContext<MainStateModel>) {
    patchState({
      sideBarOpen: true
    })
  }


  @Action(MainActions.CloseSideBar)
  closeSideBar({ patchState }: StateContext<MainStateModel>) {
    patchState({
      sideBarOpen: false
    })
  }


  @Action(MainActions.ToggleSideBar)
  toggleSideBar({ getState, patchState }: StateContext<MainStateModel>) {
    const currentState = getState();
    patchState({
      ...currentState,
      sideBarOpen: !currentState.sideBarOpen,
    });
  }

  @Action(MainActions.UpdateLocation)
  updateLocations({ patchState }: StateContext<MainStateModel>, { payload }: MainActions.UpdateLocation) {
    patchState({
      location: payload   // should be [lat, long]
    })
  }

  @Action(MainActions.UpdateMapLayersLoaded)
  updateMapLayersLoaded({ patchState }: StateContext<MainStateModel>, { payload }: MainActions.UpdateMapLayersLoaded) {
    patchState({
      mapLayersLoaded: payload
    })
  }




}
