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

export interface TemperatureData {
  tempC: number;
  iconURI?: string;
}

export interface WeatherData {
  temperature: TemperatureData;
  wind: WindData;
}

export interface WindData {
  windDegree: number;
  windDir: string;
  windKph: number;
}

export interface Action<T, P> {
  type: T;
  payload: P;
}
