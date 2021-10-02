export namespace TideActions {
  export class UpdateUnixTimestamp {
    static readonly type = "[Tide] Update UnixTimeStamp";
    constructor(public payload: number) { }
  }



}
