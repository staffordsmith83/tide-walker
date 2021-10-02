export namespace TideActions {

  export class UpdateUnixTimestamp {
    static readonly type = "[Tide] Update UnixTimeStamp";
    constructor(public payload: number) { }
  }

  export class UpdateTideHeight {
    static readonly type = "[Tide] Update TideHeight";
    constructor(public payload: number) { }
  }



}
