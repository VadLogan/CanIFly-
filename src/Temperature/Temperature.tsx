import {FC} from 'react';
import {View, Image} from 'react-native';
import AppText from '../AppText';
import {TemperatureData as TemperatureProps} from '../../types';

export const Temperature: FC<TemperatureProps> = ({tempC, iconURI}) => {
  return (
    <View>
      {iconURI && <Image source={{uri: iconURI}} />}
      <AppText>{`${tempC}°C`}</AppText>
    </View>
  );
};
