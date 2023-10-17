import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
  SensorData,
} from 'react-native-sensors';
import AppText from '../AppText';

const getDirection = (degree: number) => {
  if (degree >= 22.5 && degree < 67.5) {
    return 'NE';
  } else if (degree >= 67.5 && degree < 112.5) {
    return 'E';
  } else if (degree >= 112.5 && degree < 157.5) {
    return 'SE';
  } else if (degree >= 157.5 && degree < 202.5) {
    return 'S';
  } else if (degree >= 202.5 && degree < 247.5) {
    return 'SW';
  } else if (degree >= 247.5 && degree < 292.5) {
    return 'W';
  } else if (degree >= 292.5 && degree < 337.5) {
    return 'NW';
  } else {
    return 'N';
  }
};

function getAngle(magnetometer: SensorData) {
  let angle = 0;
  if (magnetometer) {
    let {x, y} = magnetometer;
    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(angle);
}

export function Compass() {
  const [magnetometerData, setMagnetometerData] = useState(0);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 16);
    const subscription = magnetometer.subscribe({
      next: sensorData => setMagnetometerData(getAngle(sensorData)),
      error: error => console.log(error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View>
      <AppText>{getDirection(magnetometerData)}</AppText>
    </View>
  );
}
