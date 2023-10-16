export enum ZONE_STATUS {
  ALLOW = 'allow',
  RESTRICTED = 'restricted',
  FORBIDDEN = 'forbidden',
}

export interface GeoPosition {
  lat: number;
  lon: number;
}

export interface GetZoneParams extends GeoPosition {
  lat: number;
  lon: number;
}

export interface WeatherData {
  wind: WindData;
}

export interface WindData {
  windDegree: number;
  windDir: string;
  windKph: number;
}
