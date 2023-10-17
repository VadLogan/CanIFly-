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
import {ZONE_STATUS} from './types';
import {useGeoZoneData} from './App.hooks';
import {Wind} from './src/Wind/Wind';
import {H1} from './src/H1/H1';
import {H2} from './src/H2/H2';
import {Temperature} from './src/Temperature/Temperature';

const APP_ZONE_TEXT = {
  [ZONE_STATUS.ALLOW]: 'GREEN ZONE',
  [ZONE_STATUS.RESTRICTED]: 'RESTRICTED ZONE',
  [ZONE_STATUS.FORBIDDEN]: 'FORBIDEN ZONE',
};

function App(): JSX.Element {
  const {
    zoneStatus,
    isLoading,
    isConnected,
    globalError,
    windData,
    temperatureData,
  } = useGeoZoneData();
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

      <H1 style={styles.textAlign}>Can I Fly ?</H1>
      <View style={styles.block}>
        {temperatureData && (
          <View style={styles.block}>
            <H1 style={styles.textAlign}>TEMPERATURE :</H1>
            <Temperature {...temperatureData} />
          </View>
        )}
        {windData && (
          <View style={styles.block}>
            <H1 style={styles.textAlign}>WIND :</H1>
            <Wind {...windData} />
          </View>
        )}
      </View>
      <View style={styles.block}>
        <H1 style={styles.textAlign}>ZONE :</H1>
        <H2 style={styles.textAlign}>{APP_ZONE_TEXT[zoneStatus]}</H2>
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
