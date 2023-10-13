/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ActivityIndicator,
  AppState,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from 'react-native-geolocation-service';
import {AppText} from './Components/AppText';
import {getZoneData} from './API';
import {GREEN, RED, YELLOW} from './Config/pallet';
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

function useGeoZoneData() {
  const [zoneStatus, setZoneStatus] = useState<ZONE_STATUS>();
  const [isLoading, setIsLoading] = useState(true);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        mapCurrentUserPosotionToZone();
      }

      appState.current = nextAppState;
    });

    mapCurrentUserPosotionToZone();
    return () => {
      subscription.remove();
    };
  }, []);

  async function mapCurrentUserPosotionToZone() {
    await requestLocationPermission();

    Geolocation.getCurrentPosition(
      async success => {
        setIsLoading(true);
        const status = await getZoneData({
          lat: success.coords.latitude,
          lon: success.coords.longitude,
        });

        setZoneStatus(status);

        setIsLoading(false);
        console.log({success});
      },
      err => {
        setIsLoading(false);
        console.log({err});
      },
    );
  }

  return {
    zoneStatus,
    isLoading,
  };
}

const APP_ZONE_TEXT = {
  [ZONE_STATUS.ALLOW]: 'GREEN ZONE',
  [ZONE_STATUS.RESTRICTED]: 'RESTRICTED ZONE',
  [ZONE_STATUS.FORBIDDEN]: 'FORBIDEN ZONE',
};

function App(): JSX.Element {
  const {zoneStatus, isLoading} = useGeoZoneData();
  const isDarkMode = useColorScheme() === 'dark';
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.text, styles.blackColor]}>Checking...</AppText>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const backgroundStyle = isLoading
    ? styles.loadingFlightZone
    : zoneStatus === ZONE_STATUS.ALLOW
    ? styles.freeFlightZone
    : zoneStatus === ZONE_STATUS.RESTRICTED
    ? styles.restrictedZone
    : styles.forbiddenZone;

  return (
    <SafeAreaView style={[styles.root, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View>
        <AppText style={styles.text}>Can I Fly ?</AppText>
        <AppText style={styles.text}>{APP_ZONE_TEXT[zoneStatus]}</AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFlightZone: {
    backgroundColor: Colors.white,
  },
  freeFlightZone: {
    backgroundColor: GREEN,
  },
  restrictedZone: {
    backgroundColor: YELLOW,
  },
  forbiddenZone: {
    backgroundColor: RED,
  },
  text: {
    textAlign: 'center',
    fontSize: 22,
  },
  blackColor: {
    color: '#000',
  },
});

export default App;
