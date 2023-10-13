export enum ZONE_STATUS {
  ALLOW = 'allow',
  RESTRICTED = 'restricted',
  FORBIDDEN = 'forbidden',
}

export interface GetZoneParams {
  lat: number;
  lon: number;
}
