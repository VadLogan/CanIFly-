export interface ReqData {
  flight_category: string;
  flight_subcategory: string;
  flight_type: string;
  lat: number;
  lon: number;
  mass: number;
  max_height: 596;
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
