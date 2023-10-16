export interface ReqData {
  flight_category: string;
  flight_subcategory: string;
  flight_type: string;
  lat: number;
  lon: number;
  mass: number;
  max_height: number;
  range: number;
  // Date in ISO format
  start_time: string;
}

export interface APIData {
  state: string;
  type: string;
  payload: Payload;
}

export interface Payload {
  conflicts: Conflicts;
}
export interface Conflicts {
  requestStatus: string;
  requirements?: string[] | null;
  conflictedZones?: string[] | null;
  conflictedZonesGeometry: ConflictedZonesGeometry;
}
export interface ConflictedZonesGeometry {
  type: string;
  coordinates?: ((number[] | null)[] | null)[] | null;
}

export interface WeatherAPIData {
  current: Current;
  location: Location;
}
export interface Current {
  cloud: number;
  condition?: null[] | null;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  humidity: number;
  is_day: number;
  last_updated: string;
  last_updated_epoch: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  wind_degree: number;
  wind_dir: string;
  wind_kph: number;
  wind_mph: number;
}
export interface Location {
  country: string;
  lat: number;
  localtime: string;
  localtime_epoch: number;
  lon: number;
  name: string;
  region: string;
  tz_id: string;
}
