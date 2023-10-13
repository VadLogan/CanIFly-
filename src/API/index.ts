import axios, {AxiosResponse} from 'axios';
import {ZONE_STATUS, GetZoneParams} from '../../types';
import {API_URL, FORBIDDEN_ZONES, RESTRICTED_ZONES} from './constants';
import {ReqData, APIData} from './types';

export async function getZoneData(param: GetZoneParams): Promise<ZONE_STATUS> {
  const {data} = await axios.post<APIData, AxiosResponse<APIData>, ReqData>(
    API_URL,
    {
      flight_category: 'OPEN',
      flight_subcategory: 'A1',
      flight_type: 'VLOS',
      lat: param.lat,
      lon: param.lon,
      mass: 70,
      max_height: 200,
      range: 1,
      start_time: new Date().toISOString(),
    },
    {
      headers: {
        'Mid_1.0.0': '03dc0c84-8331-4846-b020-4e0db421bf62',
      },
    },
  );
  const conflictedZones = data?.payload?.conflicts?.conflictedZones || [];
  if (!conflictedZones.length) {
    return ZONE_STATUS.ALLOW;
  }
  // check if zone forbidden
  if (conflictedZones.some(zone => FORBIDDEN_ZONES.includes(zone))) {
    return ZONE_STATUS.FORBIDDEN;
  }
  // check if zone restricted
  if (conflictedZones.some(zone => RESTRICTED_ZONES.includes(zone))) {
    return ZONE_STATUS.RESTRICTED;
  }
  return ZONE_STATUS.FORBIDDEN;
}
