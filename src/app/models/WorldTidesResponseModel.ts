export interface WorldTidesResponse {
    status: number;
    callCount: number;
    copyright: string;
    requestLat: number;
    requestLon: number;
    responseLat: number;
    responseLon: number;
    atlas: string;
    station: string;
    heights: Height[];
  }
  
  export interface Height {
    dt: number;
    date: string;
    height: number;
  }