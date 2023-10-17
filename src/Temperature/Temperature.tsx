import React, {FC} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {TemperatureData as TemperatureProps} from '../../types';
import {H1} from '../H1/H1';

export const Temperature: FC<TemperatureProps> = ({tempC, iconURI}) => {
  return (
    <View>
      {iconURI && (
        <View style={styles.contentCenter}>
          <Image
            source={{
              uri: `https:${iconURI}`,
              headers: {
                Pragma: 'no-cache',
              },
            }}
            style={styles.image}
          />
        </View>
      )}
      <H1 style={styles.textAlign}>{`${tempC}°C`}</H1>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
  },
  textAlign: {
    textAlign: 'center',
  },
  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
