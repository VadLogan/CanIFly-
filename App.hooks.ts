import {useEffect, useState, useRef} from 'react';
import {PermissionsAndroid, Platform, AppState} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNetInfo} from '@react-native-community/netinfo';
import {getZoneData} from './src/API';
import {ZONE_STATUS} from './types';

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
          mapCurrentUserPosotionToZone();
        }

        appState.current = nextAppState;
      },
    );

    mapCurrentUserPosotionToZone();
    return () => {
      subscription.remove();
    };
  }, [isConnected]);

  async function mapCurrentUserPosotionToZone() {
    try {
      setIsLoading(true);
      await requestLocationPermission();
      Geolocation.getCurrentPosition(
        async success => {
          const status = await getZoneData({
            lat: success.coords.latitude,
            lon: success.coords.longitude,
          });

          setZoneStatus(status);

          setIsLoading(false);
        },
        err => {
          setIsLoading(false);
          console.log({err});
        },
      );
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  return {
    zoneStatus,
    isLoading,
    isConnected,
  };
}
