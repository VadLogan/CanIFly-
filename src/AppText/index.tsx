import React, {PropsWithChildren} from 'react';
import {Text, StyleSheet} from 'react-native';
import {WHITE} from '../../Config/pallet';

interface AppTextProps {
  style?: StyleSheet.NamedStyles<unknown>;
}

export const AppText = ({style, children}: PropsWithChildren<AppTextProps>) => {
  const appTextStyles = [styles.root, style];
  return <Text style={appTextStyles}>{children}</Text>;
};

const styles = StyleSheet.create({
  root: {
    color: WHITE,
  },
});

export default AppText;
