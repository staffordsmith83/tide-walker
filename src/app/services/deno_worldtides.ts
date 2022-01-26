const WORLTIDES_URL = 'https://www.worldtides.info/api/v2'

type datumValues = 'LAT'
  | 'MLLWS'
  | 'MLWS'
  | 'MHLWS'
  | 'MLLW'
  | 'MLW'
  | 'MHLW'
  | 'MLLWN'
  | 'MLWN'
  | 'MHLWN'
  | 'MTL'
  | 'MSL'
  | 'MLHWN'
  | 'MHWN'
  | 'MHHWN'
  | 'MLHW'
  | 'MHW'
  | 'MHHW'
  | 'MLHWS'
  | 'MHWS'
  | 'MHHWS'
  | 'HAT'

type plot = {
  width?: number
  height?: number
  fontSize?: number
  grid?: 'none' | 'course' | 'fine'
  color?: string
  background?: string
}

type parameters = {
  key?: string
  heights?: boolean,
  extremes?: boolean,
  date?: Date,
  days?: 1|2|3|4|5|6|7,
  datum?: datumValues,
  datums?: boolean,
  lat?: number,
  lon?: number,
  plot?: plot | boolean,
  stationDistance?: number,
  stations?: boolean,
  start?: number,
  length?: number,
  step?: number,
  localtime?: boolean,
}

type apiResponse = {
  status: number,
  error?: string,
  requestDatum?: datumValues,
  responseDatum?: datumValues,
  requestLat: number,
  requestLon: number,
  responseLat: number,
  responseLon: number,
  callCount: number,
  atlas: string,
  station?: string,
  copyright: string,
  plot?: string,
  stations?: {
    id: string,
    name: string,
    lat: string,
    lon: string,
    timezone: string,
  }[],
  stationDistance?: number,
  heights: {
    dt: number,
    date: string,
    height: number,
  }[],
  extremes: {
    dt: number,
    date: string,
    height: number,
    type: 'Low' | 'High'
  }[],
  datums: {
    name: string,
    height: number
  }[]
}

export class Worldtides {
  private parameters: parameters
  constructor(parameters: parameters & { key: string }) {
    this.parameters= parameters
  }

  public setParameters(parameters: parameters) {
    this.parameters = {
      ...this.parameters,
      ...parameters
    }
  }

  public async request(parameters: parameters): Promise<apiResponse> {
    const url = this.buildUrl(parameters)
    const result = await fetch(
      url
    )
    return result.json()
  }

  private buildUrl(parameters: parameters): string {
    if (!parameters.key && !this.parameters.key) {
      throw new Error('API key required')
    }
    if (parameters.lat === undefined && this.parameters.lat === undefined) {
      throw new Error('Lat required')
    }
    if (!parameters.lon === undefined && !this.parameters.lon === undefined) {
      throw new Error('Lon required')
    }
    const finalParameters = {
      ...this.parameters,
      ...parameters
    }

    finalParameters.lat = parameters.lat === undefined ? this.parameters.lat : parameters.lat
    finalParameters.lon = parameters.lon === undefined ? this.parameters.lon : parameters.lon
    let url = WORLTIDES_URL
    
    return `${url}?${this.serializeQueryString(finalParameters)}`
  }

  private serializeQueryString(obj: parameters | plot): string {
    return Object.entries(obj).map(
      ([key, value]) => {
        if (value === undefined) {
          return null
        }
        if (value instanceof Date) {
          let month: number | string = value.getMonth() + 1
          if (month < 10) {
            month = '0' + month
          }
          let day: number | string = value.getDate() + 1
          if (day < 10) {
            day = '0' + day
          }
          value = `${value.getFullYear()}-${month}-${day}`
        }
        else if (typeof value === 'object') {
          return this.serializeQueryString(value)
        }
        if (value === true) {
          return key
        }
        return `${key}=${encodeURIComponent(value)}`
      }
    ).filter(e => e).join('&')
  }
}