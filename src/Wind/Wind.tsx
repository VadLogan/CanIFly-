import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {WindData as WindDataProps} from '../../types';
import {H2} from '../H2/H2';

export const Wind: FC<WindDataProps> = ({windDegree, windDir, windKph}) => {
  return (
    <View>
      <H2 style={styles.textAlign}>{`Degree: ${windDegree}`}</H2>
      <H2 style={styles.textAlign}>{`Direction: ${windDir}`}</H2>
      <H2 style={styles.textAlign}>{`Speed: ${windKph} km/h`}</H2>
    </View>
  );
};

const styles = StyleSheet.create({
  textAlign: {
    textAlign: 'center',
  },
});
