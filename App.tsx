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

const APP_ZONE_TEXT = {
  [ZONE_STATUS.ALLOW]: 'GREEN ZONE',
  [ZONE_STATUS.RESTRICTED]: 'RESTRICTED ZONE',
  [ZONE_STATUS.FORBIDDEN]: 'FORBIDEN ZONE',
};

function App(): JSX.Element {
  const {zoneStatus, isLoading, isConnected} = useGeoZoneData();
  const isDarkMode = useColorScheme() === 'dark';
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.text, styles.blackColor]}>Checking...</AppText>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!isConnected && !isLoading) {
    return (
      <SafeAreaView style={[styles.root, styles.loadingFlightZone]}>
        <AppText style={[styles.text, styles.blackColor]}>
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
