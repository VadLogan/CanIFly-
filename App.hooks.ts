import {useEffect, useState, useRef, useReducer, Reducer} from 'react';
import {PermissionsAndroid, Platform, AppState} from 'react-native';
// @ts-ignore
import Geolocation from 'react-native-geolocation-service';
import {useNetInfo} from '@react-native-community/netinfo';
import {getZoneData, getZoneWeather} from './src/API';
import {WindData, ZONE_STATUS, Action, TemperatureData} from './types';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    if (PermissionsAndroid.RESULTS.ACCESS_FINE_LOCATION === 'granted') {
      return;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === 'granted') {
      return;
    }
  }
  // Currently doesn't work with IOS
  throw Error("Permisions doesn't granted");
}

interface State {
  zoneStatus: ZONE_STATUS;
  windData: WindData | null;
  temperatureData: TemperatureData | null;
}

const INITAL_STATE: State = {
  zoneStatus: ZONE_STATUS.ALLOW,
  windData: null,
  temperatureData: null,
};

type Actions =
  | Action<'set_zone_status', ZONE_STATUS>
  | Action<'set_wind_data', WindData | null>
  | Action<'set_temperature_data', TemperatureData | null>
  | Action<'batch_update', State>;

const reducer: Reducer<typeof INITAL_STATE, Actions> = (
  state: typeof INITAL_STATE,
  action: Actions,
) => {
  switch (action.type) {
    case 'set_zone_status': {
      return {
        ...state,
        zoneStatus: action.payload,
      };
    }
    case 'set_wind_data': {
      return {
        ...state,
        windData: action.payload,
      };
    }
    case 'set_temperature_data': {
      return {
        ...state,
        temperatureData: action.payload,
      };
    }
    case 'batch_update': {
      return {
        temperatureData: action.payload.temperatureData,
        zoneStatus: action.payload.zoneStatus,
        windData: action.payload.windData,
      };
    }
  }
};

export function useGeoZoneData() {
  const [state, dispatch] = useReducer(reducer, INITAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {isConnected} = useNetInfo();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active' &&
          isConnected
        ) {
          mapCurrentUserPosotionToZoneData();
        }

        appState.current = nextAppState;
      },
    );

    mapCurrentUserPosotionToZoneData();
    return () => {
      subscription.remove();
    };
  }, [isConnected]);

  async function mapCurrentUserPosotionToZoneData() {
    try {
      setIsLoading(true);
      await requestLocationPermission();
      Geolocation.getCurrentPosition(
        async success => {
          try {
            const [status, weather] = await Promise.all([
              getZoneData({
                lat: success.coords.latitude,
                lon: success.coords.longitude,
              }),
              getZoneWeather({
                lat: success.coords.latitude,
                lon: success.coords.longitude,
              }),
            ]);

            const {wind, temperature} = weather;

            dispatch({
              type: 'batch_update',
              payload: {
                windData: wind,
                temperatureData: temperature,
                zoneStatus: status,
              },
            });
          } catch (error) {
            setGlobalError(`Error: ${JSON.stringify(error)}`);
          } finally {
            setIsLoading(false);
          }
        },
        err => {
          setIsLoading(false);
          setGlobalError(`Error: ${JSON.stringify(err)}`);
        },
      );
    } catch (error) {
      setIsLoading(false);
      setGlobalError(`Error: ${JSON.stringify(error)}`);
    }
  }

  return {
    ...state,
    isLoading,
    isConnected,
    globalError,
  };
}
