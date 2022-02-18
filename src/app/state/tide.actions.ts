import { TideMeasurement } from "./tide.state";

export namespace TideActions {

  export class UpdateUnixTimestamp {
    static readonly type = "[Tide] Update UnixTimeStamp";
    constructor(public payload: number) { }
  }

  export class UpdateTideHeight {
    static readonly type = "[Tide] Update TideHeight";
    constructor(public payload: number) { }
  }

  export class UpdateTideStation {
    static readonly type = "[Tide] Update TideStation";
    constructor(public payload: string | undefined) { }
  }

  export class UpdateTideWmsUrl {
    static readonly type = "[Tide] Update Tide Wms Url"
    constructor(public payload: string) { }
  }

  export class UpdateTideWmsLegendGraphicUrl {
    static readonly type = "[Tide] Update Tide Wms Legend Graphic URL"
    constructor(public payload: string) { }
  }

  export class UpdateTidesArray {
    static readonly type = "[Tide] Update Tides Array"
    constructor(public payload: TideMeasurement[]) { }
  }

  //////////////////////////////////////////////////////
  // TODO:
  // Implement one action to update everything? What is our main thing, tide height, or datetime? Datetime and Location are really the inputs, everything else flows from there.
  // export class UpdateChartAndMapData {
  //   static readonly type = "[Tide] Update Chart and Map Data"
  //   constructor(public payload: string[]) { }
  // }


}
