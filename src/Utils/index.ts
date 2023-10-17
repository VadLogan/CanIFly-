import {ENTITY_STATUS} from '../../types';

export function getWindStatus(windSpeed: number): ENTITY_STATUS {
  if (windSpeed < 4) {
    return ENTITY_STATUS.ALLOW;
  }

  if (windSpeed > 4 && windSpeed < 8) {
    return ENTITY_STATUS.RESTRICTED;
  }

  return ENTITY_STATUS.FORBIDDEN;
}

export function getCoordsStatus(
  zoneStatus: ENTITY_STATUS,
  windStatus?: ENTITY_STATUS,
): ENTITY_STATUS {
  if (
    zoneStatus === ENTITY_STATUS.RESTRICTED ||
    zoneStatus === ENTITY_STATUS.FORBIDDEN
  ) {
    return zoneStatus;
  }

  if (
    windStatus === ENTITY_STATUS.RESTRICTED ||
    windStatus === ENTITY_STATUS.FORBIDDEN
  ) {
    return windStatus;
  }

  return ENTITY_STATUS.ALLOW;
}
