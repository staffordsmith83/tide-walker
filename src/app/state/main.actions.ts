export namespace MainActions {
  export class OpenSideBar {
    static readonly type = "[Main] Open SideBar";
  }

  export class CloseSideBar {
    static readonly type = "[Main] Close SideBar";
  }

  export class ToggleSideBar {
    static readonly type = "[Main] Toggle SideBar";
  }

  export class UpdateLocation {
    static readonly type = "[Main] Update Location";
    // should be [lat, long]
    constructor(public payload: [number, number] | undefined) { }
  }
  export class UpdateMapLayersLoaded {
    static readonly type = "[Main] Update Map Layers Loaded";
    constructor(public payload: boolean) { }
  }

}
