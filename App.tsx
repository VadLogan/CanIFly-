/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {AppText} from './src/AppText';

import {GREEN, RED, YELLOW} from './Config/pallet';
import {ENTITY_STATUS as ZONE_STATUS} from './types';
import {useGeoZoneData} from './App.hooks';
import {H1} from './src/H1/H1';
import {getWindStatus, getCoordsStatus} from './src/Utils';

const APP_ZONE_TEXT = {
  [ZONE_STATUS.ALLOW]: 'GREEN ZONE',
  [ZONE_STATUS.RESTRICTED]: 'RESTRICTED ZONE',
  [ZONE_STATUS.FORBIDDEN]: 'FORBIDEN ZONE',
};

function App(): JSX.Element {
  const {zoneStatus, isLoading, isConnected, globalError, windData} =
    useGeoZoneData();
  const isDarkMode = useColorScheme() === 'dark';

  if (globalError) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.textAlign, styles.redColor]}>
          {globalError}
        </AppText>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.textAlign, styles.blackColor]}>
          Checking...
        </AppText>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!isConnected && !isLoading) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.textAlign, styles.blackColor]}>
          No Internet connection
        </AppText>
      </SafeAreaView>
    );
  }
  const windStatus = windData ? getWindStatus(windData.windKph) : undefined;
  const cordsStatus = getCoordsStatus(zoneStatus, windStatus);
  const backgroundStyle = isLoading
    ? styles.loadingFlightZone
    : cordsStatus === ZONE_STATUS.ALLOW
    ? styles.freeFlightZone
    : cordsStatus === ZONE_STATUS.RESTRICTED
    ? styles.restrictedZone
    : styles.forbiddenZone;

  return (
    <SafeAreaView style={[styles.root, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <H1 style={styles.textAlign}>DRONE: BETA FPV PRO</H1>
      <View style={styles.block}>
        <View style={styles.block}>
          <H1
            style={
              styles.textAlign
            }>{`ZONE(${APP_ZONE_TEXT[zoneStatus]}):`}</H1>
          <H1 style={styles.textAlign}>{zoneStatus}</H1>
        </View>
        {windData && (
          <View style={styles.block}>
            <H1
              style={styles.textAlign}>{`WIND(${windData.windKph} km/h):`}</H1>
            <H1 style={styles.textAlign}>{windStatus}</H1>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    justifyContent: 'space-around',
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
  textAlign: {
    textAlign: 'center',
  },
  blackColor: {
    color: '#000',
  },
  redColor: {
    color: RED,
  },
  block: {
    marginVertical: 10,
  },
});

export default App;
