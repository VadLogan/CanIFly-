import {useEffect, useState, useRef} from 'react';
import {PermissionsAndroid, Platform, AppState} from 'react-native';
// @ts-ignore
import Geolocation from 'react-native-geolocation-service';
import {useNetInfo} from '@react-native-community/netinfo';
import {getZoneData, getZoneWeather} from './src/API';
import {WindData, ZONE_STATUS} from './types';

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

export function useGeoZoneData() {
  const [zoneStatus, setZoneStatus] = useState<ZONE_STATUS>(ZONE_STATUS.ALLOW);
  const [isLoading, setIsLoading] = useState(true);
  const [windData, setWindData] = useState<WindData | null>(null);
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
            const status = await getZoneData({
              lat: success.coords.latitude,
              lon: success.coords.longitude,
            });

            const {wind} = await getZoneWeather({
              lat: success.coords.latitude,
              lon: success.coords.longitude,
            });

            setWindData(wind);
            setZoneStatus(status);
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
    zoneStatus,
    isLoading,
    isConnected,
    windData,
    globalError,
  };
}
