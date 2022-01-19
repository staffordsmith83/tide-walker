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

}
