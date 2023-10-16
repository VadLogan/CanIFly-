import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '../AppText';
import {WindData as WindDataProps} from '../../types';

export const Wind: FC<WindDataProps> = ({windDegree, windDir, windKph}) => {
  return (
    <View>
      <AppText style={styles.text}>{`Degree: ${windDegree}`}</AppText>
      <AppText style={styles.text}>{`Direction: ${windDir}`}</AppText>
      <AppText style={styles.text}>{`Speed: ${windKph} km/h`}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
});
